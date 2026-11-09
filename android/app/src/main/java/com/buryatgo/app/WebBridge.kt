package com.buryatgo.app

import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.speech.tts.TextToSpeech
import android.webkit.JavascriptInterface
import android.webkit.WebView
import java.util.Locale

/**
 * Мост между JavaScript (window.AndroidBridge) и Android.
 * Методы вызываются из фонового потока WebView, поэтому работа с UI переносится в главный поток.
 */
class WebBridge(private val activity: MainActivity, private val webView: WebView) : TextToSpeech.OnInitListener {

    private val main = Handler(Looper.getMainLooper())
    private var tts: TextToSpeech? = TextToSpeech(activity.applicationContext, this)
    @Volatile private var ttsReady = false
    private var pendingReminder = false
    @Volatile private var voiceGender = "female"

    private val vibrator: Vibrator? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            activity.getSystemService(VibratorManager::class.java)?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            activity.getSystemService(Vibrator::class.java)
        }

    override fun onInit(status: Int) {
        val engine = tts ?: return
        if (status != TextToSpeech.SUCCESS) return
        val r = engine.setLanguage(Locale("ru", "RU"))
        ttsReady = if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
            engine.setLanguage(Locale.getDefault()) >= TextToSpeech.LANG_AVAILABLE
        } else true
        engine.setPitch(1.05f)
        applyGender()
    }

    @JavascriptInterface
    fun isNative(): Boolean = true

    @JavascriptInterface
    fun haptic(kind: String?) {
        val v = vibrator ?: return
        if (!v.hasVibrator()) return
        try {
            val effect = when (kind) {
                "success" -> VibrationEffect.createWaveform(longArrayOf(0, 18, 60, 28), -1)
                "error" -> VibrationEffect.createWaveform(longArrayOf(0, 35, 60, 35), -1)
                else -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    VibrationEffect.createPredefined(VibrationEffect.EFFECT_TICK)
                } else {
                    VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE)
                }
            }
            v.vibrate(effect)
        } catch (_: Exception) { }
    }

    @JavascriptInterface
    fun speak(text: String?, rate: Double) {
        val engine = tts ?: return
        if (!ttsReady || text.isNullOrBlank()) return
        main.post {
            try {
                engine.setSpeechRate(rate.toFloat().coerceIn(0.3f, 2.0f))
                engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "bg_" + System.currentTimeMillis())
            } catch (_: Exception) { }
        }
    }

    /** «Женский голос» (по умолчанию, Irina) / «Мужской голос» (Pavel). */
    @JavascriptInterface
    fun setVoiceGender(g: String?) {
        voiceGender = if (g == "male") "male" else "female"
        main.post { applyGender() }
    }

    private fun applyGender() {
        val engine = tts ?: return
        if (!ttsReady) return
        try {
            val male = voiceGender == "male"
            val ru = engine.voices?.filter { it.locale.language == "ru" }.orEmpty()
            val pick = ru.firstOrNull { v ->
                val n = v.name.lowercase(Locale.ROOT)
                if (male) (n.contains("male") && !n.contains("female")) || n.contains("pavel") || n.contains("dmitr") || n.contains("yuri")
                else n.contains("female") || n.contains("irina") || n.contains("milena") || n.contains("svetlana")
            }
            if (pick != null) {
                engine.voice = pick
                engine.setPitch(1.05f)
            } else {
                engine.setPitch(if (male) 0.8f else 1.05f)
            }
        } catch (_: Exception) { }
    }

    @JavascriptInterface
    fun setReminder(enabled: Boolean, hour: Int, minute: Int) {
        val ctx = activity.applicationContext
        Reminder.save(ctx, enabled, hour, minute)
        if (enabled && !activity.hasNotificationPermission()) {
            pendingReminder = true
            main.post { activity.requestNotificationPermission() }
            return
        }
        Reminder.schedule(ctx)
    }

    @JavascriptInterface
    fun testNotification() {
        if (!activity.hasNotificationPermission()) {
            main.post { activity.requestNotificationPermission() }
            return
        }
        Reminder.show(activity.applicationContext, test = true)
    }

    fun onPermissionResult(granted: Boolean) {
        val ctx = activity.applicationContext
        if (!granted) Reminder.save(ctx, false, Reminder.hour(ctx), Reminder.minute(ctx))
        if (pendingReminder || granted) Reminder.schedule(ctx)
        pendingReminder = false
        main.post {
            webView.evaluateJavascript("window.BG && window.BG.onNotifPermission($granted)", null)
        }
    }

    fun stopSpeaking() {
        try { tts?.stop() } catch (_: Exception) { }
    }

    fun shutdown() {
        try { tts?.stop(); tts?.shutdown() } catch (_: Exception) { }
        tts = null
    }
}
