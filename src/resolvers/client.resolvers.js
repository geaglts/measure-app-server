import { Client, User, Phone } from "../models";

export default {
    Query: {
        getClients: async (obj, { userId }, { currentuser }) => {
            if (!currentuser) {
                return {
                    message: "No autorizado",
                    loading: false,
                };
            }

            try {
                const clients = await Client.find({ user: userId });

                return {
                    clients,
                    loading: false,
                };
            } catch (error) {
                return {
                    message: "Verifique su informacion",
                    loading: false,
                };
            }
        },
    },
    Mutation: {
        addClient: async (obj, { input }, { currentuser }) => {
            if (!currentuser) {
                return {
                    message: "No autorizado",
                    loading: false,
                };
            }

            try {
                const measures = { ...input.measures };
                const phoneNumber = { ...input.phone };

                const name = String(input.name.trim()).replace(/\b\w/g, (l) =>
                    l.toUpperCase()
                );

                const user = input.user.trim();

                input = { name, user, measures };

                if (name.length === 0 || user.length === 0) {
                    return {
                        message: "no puede haber campos vacios",
                        loading: false,
                    };
                }

                const cliente = await Client.findOne({
                    name,
                    user,
                });

                if (cliente) {
                    return {
                        message: "Ya hay un cliente con ese nombre",
                        success: false,
                        loading: false,
                    };
                }

                const theUser = await User.findById(user);
                const client = new Client({ ...input });
                const phone = new Phone({
                    ...phoneNumber,
                    client: client._id,
                    isMain: true,
                });

                await phone.save();
                client.phones.push(phone);
                await client.save();
                theUser.clients.push(client);
                await theUser.save();

                return {
                    message: "Cliente agregado con exito",
                    loading: false,
                    success: true,
                };
            } catch (err) {
                console.log(err);
                return {
                    message: "Verifique su informacion",
                    loading: false,
                    success: false,
                };
            }
        },
        removeClient: async (obj, { clientId }, { currentuser }) => {
            try {
                if (!currentuser) {
                    return {
                        message: "No debes estar aqui",
                        loading: false,
                    };
                }

                const client = await Client.findById(clientId);
                if (!client) {
                    return {
                        message: "El cliente no existe",
                        loading: false,
                    };
                }

                const user = await User.findById(currentuser.id);

                const newList = user.clients.filter(
                    (id) => String(id) !== clientId
                );

                user.clients = newList;

                await user.save();
                await Client.findByIdAndDelete(clientId);
                await Phone.deleteMany({ client: clientId });

                return {
                    message: "Eliminado con exito",
                    loading: false,
                };
            } catch (err) {
                return {
                    message: "error",
                    loading: false,
                };
            }
        },
        updateClient: async (obj, { clientId, newData }, { currentuser }) => {
            if (!currentuser) {
                return {
                    message: "No debes estar aqui",
                    loading: false,
                };
            }

            try {
                const validData = (newData) => {
                    if (!newData.name || !clientId) {
                        return false;
                    }

                    return (
                        String(newData.name).length > 3 &&
                        String(clientId).length > 0
                    );
                };

                if (validData(newData)) {
                    await Client.findByIdAndUpdate(clientId, { ...newData });

                    return {
                        message: "good",
                        loading: false,
                    };
                } else {
                    return {
                        message: "Verique su informacion",
                        loading: false,
                    };
                }
            } catch (err) {
                return {
                    message: "err",
                    loading: false,
                };
            }
        },
    },
    Client: {
        user: async (c) => {
            return await User.findById(c.user);
        },
        phones: async (c) => {
            return await Phone.find({ client: c.id });
        },
    },
};
