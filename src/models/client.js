import { Schema, model } from "mongoose";
import Phone from "./phone";
import * as utils from "../utils";

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

clientSchema.statics.findUserClient = async function (filter) {
    const client = await clientModel.findOne(filter);

    if (!client) throw new Error("Este usuario no te pertenece.");

    return client;
};

clientSchema.pre("remove", async function (next) {
    const client = this;
    await Phone.deleteMany({ client: client._id });
    next();
});

clientSchema.methods.addMeasures = async function (measures) {
    const client = this;
    measures["creadoEl"] = utils.getDateNow();
    client.measures.push(measures);
    // Ordenación de las medidas por fecha.
    client.measures.sort((a, b) =>
        a.creadoEl == b.creadoEl ? 0 : a.creadoEl > b.creadoEl ? -1 : 1
    );
    await client.save();
    return client;
};

const clientModel = model("Client", clientSchema, "clients");

export default clientModel;
