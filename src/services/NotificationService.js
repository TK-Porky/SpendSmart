// Stub NotificationService - notifications disabled temporarily
// TODO: Add notifications with a compatible library later

import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  constructor() {
    console.log('NotificationService: Notifications are currently disabled');
  }

  async createNotificationChannel() {
    // Stub
  }

  async requestNotificationPermissions() {
    return true;
  }

  async scheduleDailyTransactionReminder(hour, minute) {
    await AsyncStorage.setItem('dailyTransactionReminder', JSON.stringify({ hour, minute, enabled: true }));
    console.log(`Daily transaction reminder scheduled for ${hour}:${minute} (stub)`);
  }

  async cancelDailyTransactionReminder() {
    await AsyncStorage.removeItem('dailyTransactionReminder');
    console.log("Daily transaction reminder cancelled (stub)");
  }

  async cancelAllNotifications() {
    console.log("All notifications cancelled (stub)");
  }

  async cancelAllTriggers() {
    console.log("All triggers cancelled (stub)");
  }

  async testSimpleNotification() {
    console.log("Test notification (stub) - notifications disabled");
  }

  async getDailyTransactionReminderStatus() {
    const status = await AsyncStorage.getItem('dailyTransactionReminder');
    return status ? JSON.parse(status) : { hour: 20, minute: 0, enabled: false };
  }

  async scheduleAttachCardReminder(date, repeatFrequency = null) {
    console.log(`Attach card reminder scheduled for ${date} (stub)`);
  }

  async cancelAttachCardReminder() {
    console.log("Attach card reminder cancelled (stub)");
  }

  async checkBudgetsAndSendAlerts(userUid) {
    // Stub - no alerts sent
  }
}

export const notificationService = new NotificationService();
