import { Schema, model } from "mongoose";

const phoneSchema = new Schema({
    phone: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 10,
        validate(value) {
            const regExp = /[a-z]+/;
            if (regExp.test(value)) {
                throw new Error("El teléfono no puede contener letras.");
            }
        },
    },
    isMain: {
        type: Boolean,
        default: false,
    },
    client: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Client",
    },
    phoneType: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "PhoneType",
    },
});

export default model("Phone", phoneSchema, "phones");
