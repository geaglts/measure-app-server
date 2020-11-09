import { User, Client, PhoneType, Phone } from "../../models/";

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
