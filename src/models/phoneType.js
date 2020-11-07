import { Schema, model } from "mongoose";

const phoneTypeSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true,
    },
});

export default model("PhoneType", phoneTypeSchema, "phone_types");
