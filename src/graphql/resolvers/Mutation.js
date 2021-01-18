import { User, Client, Phone, PhoneType } from "../../models/";
import { parseErrors } from "../../utils";

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

            await phoneClient.save();
            await client.save();
            await client.addMeasures(input.measures);

            return client;
        } catch (err) {
            throw new Error("Revise los datos.");
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
            throw new Error("Revise los datos.");
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

            await Client.findUserClient({
                _id: phoneData.client,
                user: user._id,
            });

            const repeatPhone = await Phone.countDocuments({
                phone: phoneData.phone,
                client: phoneData.client,
            });

            if (repeatPhone > 0) {
                throw new Error("Ya cuenta con un teléfono con este número.");
            }

            const phoneCreated = await Phone.insertNewPhone(phoneData);

            return phoneCreated;
        } catch (err) {
            throw new Error(err);
        }
    },
    async updatePhone(parent, { phoneData, phoneId }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            await Client.findUserClient({
                _id: phoneData.client,
                user: user._id,
            });

            const phoneFound = await Phone.findOne({
                _id: phoneId,
                client: phoneData.client,
            });

            if (!phoneFound) {
                throw new Error("El usuario no cuenta con este teléfono.");
            }

            let updateFields = ["phone", "phoneType", "isMain"];

            updateFields.forEach((field) => {
                if (phoneData[field] !== undefined) {
                    phoneFound[field] = phoneData[field];
                }
            });

            phoneFound.save();

            return {
                message: "Teléfono actualizado con éxito.",
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    async dropPhone(parent, { phoneId, clientId }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            await Client.findUserClient({
                _id: clientId,
                user: user._id,
            });

            const phone = await Phone.findOne({
                _id: phoneId,
                client: clientId,
            });

            await phone.remove();

            return {
                message: "Teléfono eliminado con éxito",
                phoneId,
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
            parseErrors(err);
        }
    },
    async logout(parent, args, { user, token }) {
        try {
            if (!user) throw new Error("No autorizado");
            user.tokens = user.tokens.filter((t) => t.token !== token);
            await user.save();
            return "Hasta luego.";
        } catch (err) {
            throw new Error(err);
        }
    },
    async logoutAll(parent, args, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            user.tokens = [];
            await user.save();
            return "Hasta luego.";
        } catch (err) {
            throw new Error(err);
        }
    },
    async createBasicPhoneTypes(parent, args, { user }) {
        try {
            const isValidUser = !user || user.userName !== "admingea";
            if (isValidUser) throw new Error("403:No autorizado");

            await PhoneType.deleteMany({});
            await PhoneType.insertMany([
                { type: "movil" },
                { type: "oficina" },
                { type: "casa" },
            ]);

            return { message: "Tipos creados correctamente." };
        } catch (err) {
            parseErrors(err);
        }
    },
};
