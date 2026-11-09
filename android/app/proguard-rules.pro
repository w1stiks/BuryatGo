# Сохраняем методы JS-моста, вызываемые из WebView
-keepclassmembers class com.buryatgo.app.WebBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
