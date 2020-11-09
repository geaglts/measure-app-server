import { Schema, model } from "mongoose";

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    measures: [
        {
            height: {
                type: Number,
                default: 0,
            },
            waist: {
                type: Number,
                default: 0,
            },
            creadoEl: {
                type: Date,
            },
        },
    ],
});

export default model("Client", clientSchema, "clients");
