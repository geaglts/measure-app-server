import { Schema, model } from "mongoose";
import { getDateNow } from "../utils";

const setIsMainPhoneFalse = async (client) => {
    await phoneModel.findOneAndUpdate(
        { isMain: true, client },
        { isMain: false }
    );
};

const setNewMainPhone = async (client) => {
    const newMainPhone = await phoneModel
        .findOne({ client })
        .sort("-createdAt");

    if (newMainPhone) {
        newMainPhone.isMain = true;
        await newMainPhone.save();
    }
};

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
    createdAt: {
        type: String,
    },
});

phoneSchema.statics.insertNewPhone = async function (phoneData) {
    const phoneCreated = new phoneModel(phoneData);
    await phoneCreated.save();
    return phoneCreated;
};

phoneSchema.pre("save", async function (next) {
    const phone = this;

    if (phone.isNew) {
        await setIsMainPhoneFalse(phone.client);
        phone.isMain = true;
        phone.createdAt = getDateNow();
    }

    if (phone.isModified("isMain")) {
        const isMain = phone.isMain;
        if (isMain) {
            await setIsMainPhoneFalse(phone.client);
        } else {
            await setNewMainPhone(phone.client);
        }
    }

    next();
});

phoneSchema.post("remove", async function () {
    const phone = this;
    if (phone.isMain) {
        await setNewMainPhone(phone.client);
    }
});

const phoneModel = model("Phone", phoneSchema, "phones");

export default phoneModel;
