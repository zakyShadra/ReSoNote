import { LocalNotifications } from "@capacitor/local-notifications";

export async function notify(title, body) {
    await LocalNotifications.schedule({
        notifications: [
        {
            title,
            body,
            id: Date.now()
        }
        ]
    });
}