import moment from "moment-timezone";

export function getDateNow() {
    return moment.tz(Date.now(), "America/Mexico_City").format();
}
