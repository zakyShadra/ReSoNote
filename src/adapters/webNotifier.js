export function notify(title, body) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(title, {
        body,
        });
    }
    }

    export async function requestPermission() {
    if ("Notification" in window) {
        await Notification.requestPermission();
    }
}