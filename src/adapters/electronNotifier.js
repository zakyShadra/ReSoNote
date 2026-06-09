export function notify(title, body) {
    window.electronAPI?.notify(title, body);
}