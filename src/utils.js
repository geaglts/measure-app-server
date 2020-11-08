export function validateAndTrimLowerInput(input = "", limitLength = 0) {
    if (input.length > limitLength) {
        let formatedInput = input.trim().toLowerCase();
        return formatedInput;
    } else {
        return null;
    }
}

export function onlyValidateLength(input = "", limitLength = 0) {
    if (input.length > limitLength) {
        return input;
    } else {
        return null;
    }
}
