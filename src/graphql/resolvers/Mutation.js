import { User, Client, Phone, PhoneType } from "../../models/";
import * as utils from "../../utils";
import * as dbUtils from "../../db-utils";

export default {
    async addClient(parent, { input }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");

            const client = new Client({
                name: input.name,
                measures: input.measures,
                user: user._id,
            });

            const phoneClient = new Phone({
                phone: input.phone.phone,
                phoneType: input.phone.phoneType,
                client: client._id,
            });

            await client.save();
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
            let aprovedClientId = utils.onlyValidateLength(clientId);
            if (!aprovedClientId) throw new Error("Este campo es requerido");

            let validClient = await dbUtils.exists("Client", {
                _id: clientId,
                user: user._id,
            });
            if (!validClient)
                throw new Error("Este cliente no existe o no le pertenece");

            await Client.findByIdAndDelete(clientId);
            await Phone.deleteMany({ client: clientId });

            return {
                msg: "Cliente eliminado correctamente",
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    async addMeasure(parent, args, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let userId = user._id;

            let newInputs = utils.onlyValidateLengthAndTrimInputs(args);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Los campos no son validos");

            // Ver si el cliente le pertenece a ese usuario
            let clientExist = await dbUtils.exists("Client", {
                _id: newInputs.clientId,
                user: userId,
            });

            if (!clientExist)
                throw new Error("Este cliente no le pertenece a ese usuario");

            let client = await Client.findById(newInputs.clientId, {
                _id: 1,
                measures: 1,
            });

            newInputs.measures["creadoEl"] = utils.getDateNow();

            client.measures.push(newInputs.measures);

            // ordenacion por fecha
            client.measures.sort((a, b) =>
                a.creadoEl == b.creadoEl ? 0 : a.creadoEl > b.creadoEl ? -1 : 1
            );

            await client.save();

            return { msg: "Medida agregada correctamente" };
        } catch (err) {
            throw new Error(err);
        }
    },
    async updateMeasure(parent, { measureData }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(measureData);
            let validInput = utils.validateObject(newInputs);
            if (!validInput) throw new Error("Verifica tus campos");

            let client = await Client.findOne(
                {
                    _id: newInputs.clientId,
                    user: user._id,
                },
                {
                    measures: 1,
                }
            );

            if (!client)
                throw new Error("Este cliente no existe o no le pertenece");

            let isMeasure = (m) => m._id == newInputs.measureId;
            let measureIndex = client.measures.findIndex(isMeasure);

            let { _id, creadoEl } = client.measures[measureIndex];
            newInputs.measures["_id"] = _id;
            newInputs.measures["creadoEl"] = creadoEl;

            client.measures[measureIndex] = newInputs.measures;

            await client.save();

            return { msg: "Medida actualizada correctamente" };
        } catch (err) {
            throw new Error(err);
        }
    },
    async dropMeasure(parent, args, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(args);
            let validInput = utils.validateObject(newInputs);
            if (!validInput) throw new Error("Verifica tus campos");

            let client = await Client.findOne({
                _id: newInputs.clientId,
                user: user._id,
            });
            if (!client)
                throw new Error("Este usuario no existe o no te pertenece");

            let compareMeasures = (m) => String(m._id) !== newInputs.measureId;
            client.measures = client.measures.filter(compareMeasures);

            await client.save();

            return { msg: "La medida fue eliminada correctamente" };
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
