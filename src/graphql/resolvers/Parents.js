import { Phone, User, PhoneType, Client } from "../../models";

export default {
    Client: {
        user: async (c) => {
            return await User.findById(c.user);
        },
        phones: async (c) => {
            return await Phone.find({ client: c.id }).sort({
                isMain: -1,
            });
        },
        mainPhone: async (c) => {
            return await Phone.findOne({ client: c.id, isMain: true });
        },
    },
    Phone: {
        phoneType: async (p) => {
            return await PhoneType.findById(p.phoneType);
        },
    },
    User: {
        clients: async (u) => {
            return await Client.find({ user: u.id });
        },
    },
    Measure: {
        creadoEl: async (m) => {
            return new Date(m.creadoEl).toUTCString();
        },
    },
};
