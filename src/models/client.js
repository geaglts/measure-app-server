import { Schema, model } from "mongoose";
import Phone from "./phone";

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
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
                required: true,
            },
            waist: {
                type: Number,
                default: 0,
                required: true,
            },
            creadoEl: {
                type: String,
            },
        },
    ],
});

clientSchema.pre("save", async function (next) {
    const client = this;

    const clientExists = await clientModel.findOne({
        name: client.name,
        user: client.user,
    });

    if (clientExists) {
        throw new Error("Ya cuenta con un cliente con este nombre.");
    }

    next();
});

clientSchema.pre("remove", async function (next) {
    const client = this;
    await Phone.deleteMany({ client: client._id });
    next();
});

const clientModel = model("Client", clientSchema, "clients");

export default clientModel;
