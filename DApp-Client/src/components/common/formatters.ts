export class Formatter {
    public static dateFormat(date: Date): string {
        let dateString =
            date.getUTCFullYear() + "/" +
            ("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" +
            ("0" + date.getUTCDate()).slice(-2) + " " +
            ("0" + date.getUTCHours()).slice(-2) + ":" +
            ("0" + date.getUTCMinutes()).slice(-2) + ":" +
            ("0" + date.getUTCSeconds()).slice(-2);

        return dateString;
    }
}