import { User, Client, Phone, PhoneType } from "../../models/";
import * as utils from "../../utils";
import * as dbUtils from "../../db-utils";

export default {
    async addClient(parent, { input }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const client = new Client({
                name: input.name,
                user: user._id,
            });

            const phoneClient = new Phone({
                phone: input.phone.phone,
                phoneType: input.phone.phoneType,
                client: client._id,
            });

            await client.save();
            await client.addMeasures(input.measures);
            await phoneClient.save();

            return client;
        } catch (err) {
            throw new Error(err);
        }
    },
    async updateClient(parent, { input }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const client = await Client.findById(input.clientId);
            if (!client) throw new Error("Cliente no encontrado.");

            if (client.name === input.name) {
                return client;
            }

            client.name = input.name;
            await client.save();

            return client;
        } catch (err) {
            throw new Error(err);
        }
    },
    async dropClient(parent, { clientId }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const client = await Client.findOne({
                user: user._id,
                _id: clientId,
            });

            if (!client)
                throw new Error("Este usuario no puede ser eliminado.");

            await client.remove();

            return client;
        } catch (err) {
            throw new Error(err);
        }
    },
    async addMeasure(parent, args, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const client = await Client.findUserClient({
                _id: args.clientId,
                user: user._id,
            });

            await client.addMeasures(args.measures);

            return { message: "Medidas agregadas correctamente." };
        } catch (err) {
            throw new Error(err);
        }
    },
    async updateMeasure(parent, { measureData }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const { measureId, clientId, measures } = measureData;

            const client = await Client.findUserClient({
                _id: clientId,
                user: user._id,
            });

            const measureIndex = client.measures.findIndex((measure) => {
                return measure._id.toString() === measureId;
            });

            client.measures[measureIndex]["height"] = measures.height;
            client.measures[measureIndex]["waist"] = measures.waist;

            await client.save();

            return { message: "Medida actualizada correctamente." };
        } catch (err) {
            throw new Error(err);
        }
    },
    async dropMeasure(parent, { clientId, measureId }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const client = await Client.findUserClient({
                _id: clientId,
                user: user._id,
            });

            client.measures = client.measures.filter((measure) => {
                const _id = measure._id.toString();
                return _id !== measureId;
            });

            await client.save();

            return { message: "La medida fue eliminada correctamente." };
        } catch (err) {
            throw new Error(err);
        }
    },
    async addPhone(obj, { phoneData }, { user }) {
        try {
            if (!user) throw new Error("No authotizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(phoneData);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Verifica tus campos");

            const client = await dbUtils.exists("Client", {
                _id: newInputs.client,
                user: user._id,
            });
            if (!client)
                throw new Error("El cliente no existe o no te pertenece");

            const validPhoneType = dbUtils.exists("PhoneType", {
                _id: newInputs.phoneType,
            });
            if (!validPhoneType)
                throw new Error("Este no es un tipo de telefono valido");

            const phoneExists = await dbUtils.exists("Phone", {
                phone: newInputs.phone,
                client: newInputs.client,
            });
            if (phoneExists) throw new Error("Este numero ya esta registrado");

            await Phone.findOneAndUpdate(
                { isMain: true, client: newInputs.client },
                { isMain: false },
                { new: true }
            );

            const newPhone = new Phone({
                isMain: true,
                ...newInputs,
            });

            await newPhone.save();

            return newPhone;
        } catch (err) {
            throw new Error(err);
        }
    },
    async updatePhone(parent, { phoneData, phoneId }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(phoneData);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Verifica tus campos");

            const validPhoneType = await dbUtils.exists("PhoneType", {
                _id: newInputs.phoneType,
            });
            if (!validPhoneType)
                throw new Error("Este no es un tipo de telefono valido");

            const phoneExists = await dbUtils.exists("Phone", {
                _id: phoneId,
                client: newInputs.client,
            });
            if (!phoneExists)
                throw new Error("Este cliente no cuenta con este telefono");

            delete newInputs["client"];
            await Phone.findByIdAndUpdate(phoneId, newInputs);

            return {
                msg: "Telefono actualizado con exito",
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    async dropPhone(parent, phoneData, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(phoneData);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Verifica tus campos");

            const phoneExists = await dbUtils.exists("Phone", {
                _id: newInputs.phoneId,
                client: newInputs.clientId,
            });
            if (!phoneExists)
                throw new Error("Este cliente no cuenta con este telefono");

            await Phone.findByIdAndDelete(newInputs.phoneId);

            return {
                msg: "Telefono eliminado con exito",
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    async addPhoneType(parent, { type }, context) {
        try {
            const phoneType = new PhoneType({ type });
            await phoneType.save();
            return phoneType;
        } catch (err) {
            throw new Error(err);
        }
    },
    async login(parent, { userName, password }) {
        try {
            const user = await User.findByCredentials(userName, password);
            const token = await user.generateAuthToken();
            return { user, token };
        } catch (err) {
            throw new Error(err);
        }
    },
    async register(parent, { input }) {
        try {
            const newUser = new User(input);
            await newUser.save();
            return newUser;
        } catch (err) {
            throw new Error(err);
        }
    },
};
