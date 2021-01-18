import moment from "moment-timezone";

export function getDateNow() {
    return moment.tz(Date.now(), "America/Mexico_City").format();
}

export function parseErrors(error) {
    const errorToString = error.toString();
    const isDuplicateName = errorToString.search("E11000") > -1;
    if (isDuplicateName) {
        throw new Error("Al parecer ya existe.");
    }
    const isUnauthorized = errorToString.search("403") > -1;
    if (isUnauthorized) {
        throw new Error(errorToString.replace("Error: 403:", ""));
    }
    throw new Error(errorToString);
}

export function isAdmin(user) {
    const isValidUser = !user || user.userName !== "admingea";
    if (isValidUser) throw new Error("403:No autorizado");
}
