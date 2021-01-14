import { User, Client, PhoneType } from "../../models/";

export default {
    async getClients(parent, args, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let userId = user._id;

            const clients = Client.find({ user: userId }).sort({
                name: 1,
            });

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
    async me(parent, args, { user }) {
        try {
            return user;
        } catch (err) {
            throw new Error(err);
        }
    },
};
