import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    clients: [
        {
            type: Schema.Types.ObjectId,
            ref: "Client",
        },
    ],
});

export default model("User", userSchema, "users");
