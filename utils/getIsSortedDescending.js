export function getIsSortedDescending(timestamps) {
    for (let i = 1; i < timestamps.length; i++) {
        if (new Date(timestamps[i - 1]) < new Date(timestamps[i])) {
            return false;
        }
    }
    return true;
}
