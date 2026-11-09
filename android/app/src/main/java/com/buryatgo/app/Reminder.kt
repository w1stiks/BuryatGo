package com.buryatgo.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import java.util.Calendar

/** Ежедневное напоминание о занятии. Работает без интернета и без точных будильников. */
object Reminder {
    private const val PREFS = "buryatgo_reminder"
    private const val CHANNEL_ID = "daily_reminder"
    private const val REQ = 1001
    private const val NOTIF_ID = 7001

    private val messages = listOf(
        "Амар мэндэ! 👋 Бато ждёт вас на уроке.",
        "🔥 Не дайте серии погаснуть — всего 5 минут!",
        "🥟 Буузы сами себя не заработают. Сайн байна!",
        "⛺ Время бурятского! Повторим новые слова?",
        "🏆 Соперники в лиге уже набирают XP. Догоните их!"
    )

    private fun prefs(c: Context) = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun save(c: Context, enabled: Boolean, hour: Int, minute: Int) {
        prefs(c).edit()
            .putBoolean("enabled", enabled)
            .putInt("hour", hour.coerceIn(0, 23))
            .putInt("minute", minute.coerceIn(0, 59))
            .apply()
    }

    fun hour(c: Context) = prefs(c).getInt("hour", 19)
    fun minute(c: Context) = prefs(c).getInt("minute", 0)

    private fun pending(c: Context): PendingIntent =
        PendingIntent.getBroadcast(
            c, REQ, Intent(c, ReminderReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

    fun schedule(c: Context) {
        val am = c.getSystemService(AlarmManager::class.java) ?: return
        val pi = pending(c)
        am.cancel(pi)
        if (!prefs(c).getBoolean("enabled", false)) return
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour(c))
            set(Calendar.MINUTE, minute(c))
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis() + 1000) add(Calendar.DAY_OF_YEAR, 1)
        }
        // Неточный будильник, работающий в режиме Doze; после срабатывания перепланируется на следующий день
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pi)
    }

    fun ensureChannel(c: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = c.getSystemService(NotificationManager::class.java) ?: return
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return
        val ch = NotificationChannel(CHANNEL_ID, c.getString(R.string.channel_name), NotificationManager.IMPORTANCE_DEFAULT)
        ch.description = c.getString(R.string.channel_desc)
        nm.createNotificationChannel(ch)
    }

    @SuppressLint("MissingPermission")
    fun show(c: Context, test: Boolean) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(c, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) return
        ensureChannel(c)
        val open = PendingIntent.getActivity(
            c, 0,
            Intent(c, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val text = if (test) "Так будет выглядеть напоминание. Баярлаа! 👍" else messages.random()
        val n = NotificationCompat.Builder(c, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat)
            .setColor(0xFF58CC02.toInt())
            .setContentTitle("BuryatGo")
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setContentIntent(open)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()
        try { NotificationManagerCompat.from(c).notify(NOTIF_ID, n) } catch (_: SecurityException) { }
    }
}

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminder.show(context, test = false)
        Reminder.schedule(context)
    }
}

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminder.schedule(context)
    }
}
