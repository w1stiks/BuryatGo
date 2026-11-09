import UIKit
import WebKit
import AVFoundation
import UserNotifications

/// Отдаёт файлы игры из папки www внутри приложения по адресу buryatgo://app/...
/// Постоянный адрес нужен, чтобы прогресс (localStorage) надёжно сохранялся между запусками.
final class LocalSchemeHandler: NSObject, WKURLSchemeHandler {
    private let root: URL

    init(root: URL) {
        self.root = root.standardizedFileURL
    }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(URLError(.badURL))
            return
        }
        var path = url.path.removingPercentEncoding ?? url.path
        if path.isEmpty || path == "/" { path = "/index.html" }
        let fileURL = root.appendingPathComponent(String(path.drop(while: { $0 == "/" }))).standardizedFileURL
        guard fileURL.path.hasPrefix(root.path), let data = try? Data(contentsOf: fileURL) else {
            let notFound = HTTPURLResponse(url: url, statusCode: 404, httpVersion: "HTTP/1.1", headerFields: ["Content-Type": "text/plain"])!
            urlSchemeTask.didReceive(notFound)
            urlSchemeTask.didReceive(Data("Not found".utf8))
            urlSchemeTask.didFinish()
            return
        }
        let headers = [
            "Content-Type": LocalSchemeHandler.mime(fileURL.pathExtension),
            "Content-Length": String(data.count),
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*"
        ]
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers)!
        urlSchemeTask.didReceive(response)
        urlSchemeTask.didReceive(data)
        urlSchemeTask.didFinish()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private static func mime(_ ext: String) -> String {
        switch ext.lowercased() {
        case "html", "htm": return "text/html; charset=utf-8"
        case "js", "mjs": return "text/javascript; charset=utf-8"
        case "css": return "text/css; charset=utf-8"
        case "json": return "application/json; charset=utf-8"
        case "webmanifest": return "application/manifest+json"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "gif": return "image/gif"
        case "webp": return "image/webp"
        case "svg": return "image/svg+xml"
        case "ico": return "image/x-icon"
        case "mp3": return "audio/mpeg"
        case "m4a", "mp4": return "audio/mp4"
        case "wav": return "audio/wav"
        case "ogg": return "audio/ogg"
        case "woff2": return "font/woff2"
        case "woff": return "font/woff"
        case "ttf": return "font/ttf"
        default: return "application/octet-stream"
        }
    }
}

/// Обёртка без сильной ссылки, чтобы контроллер не удерживал сам себя.
final class WeakMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?

    init(_ target: WKScriptMessageHandler) {
        self.target = target
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(userContentController, didReceive: message)
    }
}

final class WebViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
    private var webView: WKWebView!
    private let impactGen = UIImpactFeedbackGenerator(style: .light)
    private let notifyGen = UINotificationFeedbackGenerator()
    private let background = UIColor(red: 236 / 255, green: 238 / 255, blue: 242 / 255, alpha: 1)

    /// Мост для app.js: та же схема, что у Capacitor (window.Capacitor.Plugins.Haptics / LocalNotifications).
    private static let bridgeScript = """
    (function () {
      var seq = 0, cbs = {};
      window.BG_IOS = true;
      window.__bgNative = function (id, res) { var c = cbs[id]; if (c) { delete cbs[id]; c(res || {}); } };
      function call(action, payload) {
        return new Promise(function (resolve) {
          var id = ++seq; cbs[id] = resolve;
          try { window.webkit.messageHandlers.bg.postMessage({ id: id, action: action, payload: payload || {} }); }
          catch (e) { delete cbs[id]; resolve({}); }
        });
      }
      function fix(o) {
        var list = (o && o.notifications) || [];
        return { notifications: list.map(function (n) {
          var s = n.schedule || {};
          var at = s.at instanceof Date ? s.at.getTime() : (typeof s.at === 'number' ? s.at : 0);
          var out = { id: n.id, title: n.title || 'BuryatGo', body: n.body || '', schedule: { repeats: s.repeats !== false, at: at } };
          if (s.on) out.schedule.on = { hour: s.on.hour || 0, minute: s.on.minute || 0 };
          return out;
        }) };
      }
      window.Capacitor = {
        isNativePlatform: function () { return true; },
        getPlatform: function () { return 'ios'; },
        Plugins: {
          Haptics: {
            impact: function () { return call('haptic', { kind: 'light' }); },
            notification: function (o) { return call('haptic', { kind: o && o.type === 'ERROR' ? 'error' : 'success' }); }
          },
          LocalNotifications: {
            requestPermissions: function () { return call('notifPerm'); },
            checkPermissions: function () { return call('notifCheck'); },
            cancel: function (o) { return call('notifCancel', { notifications: ((o && o.notifications) || []).map(function (n) { return { id: n.id }; }) }); },
            schedule: function (o) { return call('notifSchedule', fix(o)); }
          }
        }
      };
    })();
    """

    override func loadView() {
        let config = WKWebViewConfiguration()
        if let resources = Bundle.main.resourceURL {
            config.setURLSchemeHandler(LocalSchemeHandler(root: resources.appendingPathComponent("www", isDirectory: true)), forURLScheme: "buryatgo")
        }
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = WKWebsiteDataStore.default()
        config.userContentController.addUserScript(WKUserScript(source: WebViewController.bridgeScript, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        config.userContentController.add(WeakMessageHandler(self), name: "bg")

        let web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        web.uiDelegate = self
        web.allowsLinkPreview = false
        web.allowsBackForwardNavigationGestures = false
        web.isOpaque = false
        web.backgroundColor = background
        web.scrollView.backgroundColor = background
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        if #available(iOS 16.4, *) { web.isInspectable = true }
        webView = web
        view = web
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
        impactGen.prepare()
        notifyGen.prepare()
        if let start = URL(string: "buryatgo://app/index.html") {
            webView.load(URLRequest(url: start))
        }
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .portrait }

    // MARK: - Сообщения из JavaScript

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any], let action = body["action"] as? String else { return }
        let callId = (body["id"] as? NSNumber)?.intValue ?? 0
        let payload = body["payload"] as? [String: Any] ?? [:]
        let center = UNUserNotificationCenter.current()

        switch action {
        case "haptic":
            let kind = payload["kind"] as? String ?? "light"
            if kind == "error" {
                notifyGen.notificationOccurred(.error)
            } else if kind == "success" {
                notifyGen.notificationOccurred(.success)
            } else {
                impactGen.impactOccurred()
            }
            reply(callId, [:])
        case "notifPerm":
            center.requestAuthorization(options: [.alert, .sound, .badge]) { [weak self] granted, _ in
                DispatchQueue.main.async { self?.reply(callId, ["display": granted ? "granted" : "denied"]) }
            }
        case "notifCheck":
            center.getNotificationSettings { [weak self] settings in
                let ok = settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional
                DispatchQueue.main.async { self?.reply(callId, ["display": ok ? "granted" : "denied"]) }
            }
        case "notifCancel":
            let list = payload["notifications"] as? [[String: Any]] ?? []
            center.removePendingNotificationRequests(withIdentifiers: list.compactMap { WebViewController.notificationId($0["id"]) })
            reply(callId, [:])
        case "notifSchedule":
            scheduleNotifications(payload["notifications"] as? [[String: Any]] ?? [])
            reply(callId, [:])
        default:
            reply(callId, [:])
        }
    }

    private static func notificationId(_ value: Any?) -> String? {
        if let number = value as? NSNumber { return number.stringValue }
        return value as? String
    }

    private func scheduleNotifications(_ list: [[String: Any]]) {
        let center = UNUserNotificationCenter.current()
        for item in list {
            let id = WebViewController.notificationId(item["id"]) ?? UUID().uuidString
            let content = UNMutableNotificationContent()
            content.title = item["title"] as? String ?? "BuryatGo"
            content.body = item["body"] as? String ?? ""
            content.sound = .default

            let schedule = item["schedule"] as? [String: Any] ?? [:]
            let trigger: UNNotificationTrigger
            if let on = schedule["on"] as? [String: Any] {
                var comps = DateComponents()
                comps.hour = (on["hour"] as? NSNumber)?.intValue ?? 0
                comps.minute = (on["minute"] as? NSNumber)?.intValue ?? 0
                let repeats = (schedule["repeats"] as? NSNumber)?.boolValue ?? true
                trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: repeats)
            } else {
                let atMs = (schedule["at"] as? NSNumber)?.doubleValue ?? 0
                let delay = atMs > 0 ? atMs / 1000 - Date().timeIntervalSince1970 : 1
                trigger = UNTimeIntervalNotificationTrigger(timeInterval: max(1, delay), repeats: false)
            }
            center.removePendingNotificationRequests(withIdentifiers: [id])
            center.add(UNNotificationRequest(identifier: id, content: content, trigger: trigger), withCompletionHandler: nil)
        }
    }

    private func reply(_ id: Int, _ result: [String: Any]) {
        guard id > 0 else { return }
        let data = (try? JSONSerialization.data(withJSONObject: result)) ?? Data("{}".utf8)
        let json = String(data: data, encoding: .utf8) ?? "{}"
        webView.evaluateJavaScript("window.__bgNative && window.__bgNative(\(id), \(json));", completionHandler: nil)
    }

    // MARK: - Навигация: внешние ссылки (Instagram и т.п.) открываем в системе

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url, let scheme = url.scheme?.lowercased(),
           !["buryatgo", "about", "data", "blob"].contains(scheme) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
        return nil
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }

    // MARK: - alert / confirm из JavaScript

    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(alert, animated: true)
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Отмена", style: .cancel) { _ in completionHandler(false) })
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        present(alert, animated: true)
    }
}
