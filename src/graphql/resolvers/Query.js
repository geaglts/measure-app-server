import { User, Client, PhoneType, Phone } from "../../models/";

export default {
    async getClients(parent, args, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let userId = user._id;

            const clients = User.find({ user: userId });

            return clients;
        } catch (err) {
            throw new Error(err);
        }
    },
    async getPhoneTypes(parent, args, context) {
        try {
            return await PhoneType.find();
        } catch (err) {
            throw new Error(err);
        }
    },
    /*
    getPhones: async (obj, { clientId }, { currentuser }) => {
        try {
            if (!currentuser) {
                return { loading: false };
            }

            const phones = await Phone.find({ client: clientId });

            return {
                phones,
                loading: false,
            };
        } catch (error) {
            return {
                message: "Estoy trabajando en eso",
                loading: false,
            };
        }
    },
    getMainPhone: async (obj, { clientId }, { currentuser }) => {
        try {
            if (!currentuser) {
                return { loading: false };
            }

            const phone = await Phone.findOne({
                client: clientId,
                isMain: true,
            });

            return {
                phone,
                loading: false,
            };
        } catch (err) {
            return {
                loading: false,
            };
        }
    },
    getPhoneTypes: async (obj, data, context) => {
        try {
            const phoneTypes = await PhoneType.find();

            return {
                types: phoneTypes,
                loading: false,
            };
        } catch (error) {
            return {
                message: "Estoy trabajando en eso",
                loading: false,
            };
        }
    },
    */
    async me(parent, args, { user: currentuser }) {
        try {
            if (!currentuser) throw new Error("No tiene autorización");

            let user = await User.findById(currentuser._id);
            if (!user) throw new Error("No deberias estar aqui amiga");

            return user;
        } catch (err) {
            throw new Error(err);
        }
    },
};
