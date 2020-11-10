import moment from "moment-timezone";

export function validateAndTrimLowerInput(input = "", limitLength = 0) {
    if (input.length > limitLength) {
        let formatedInput = input.trim().toLowerCase();
        return formatedInput;
    } else {
        return null;
    }
}

export function onlyValidateLength(input, limitLength = 0) {
    if (input.length > limitLength) {
        return input;
    } else {
        return null;
    }
}

export function onlyValidateLengthAndTrimInputs(input = {}, newInputs = {}) {
    let inputkeys = Object.keys(input);
    if (inputkeys.length === 0) {
        return newInputs;
    }

    let field = input[inputkeys[0]];
    delete input[inputkeys[0]];

    switch (typeof field) {
        case "string":
            {
                if (field.length === 0) return null;
                newInputs = {
                    ...newInputs,
                    [inputkeys[0]]: field.trim().toLowerCase(),
                };
            }
            break;
        case "number":
            {
                if (field.length < 2) return null;
                newInputs = { ...newInputs, [inputkeys[0]]: field };
            }
            break;
        case "object":
            newInputs = {
                ...newInputs,
                [inputkeys[0]]: onlyValidateLengthAndTrimInputs(field, {}),
            };
            break;
    }

    return onlyValidateLengthAndTrimInputs(input, newInputs);
}

export function validateObject(object = {}) {
    if (object === null) {
        return false;
    }

    for (let key in object) {
        if (object[key] === null) {
            return false;
        }
    }
    return true;
}

export function validateEspecificLength(field, length = 0) {
    if (field !== length) {
        return null;
    }
    return field;
}

export function getDateNow() {
    return moment.tz(Date.now(), "America/Mexico_City").format();
}
