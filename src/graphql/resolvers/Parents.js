export default {
    Client: {
        user: async (c) => {
            return await User.findById(c.user);
        },
        phones: async (c) => {
            return await Phone.find({ client: c.id });
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
};
