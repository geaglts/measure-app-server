import { Schema, model } from "mongoose";

const phoneSchema = new Schema({
    phone: {
        type: String,
        required: true,
    },
    isMain: {
        type: Boolean,
        default: false,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
    },
    phoneType: {
        type: Schema.Types.ObjectId,
        ref: "PhoneType",
    },
});

export default model("Phone", phoneSchema, "phones");
