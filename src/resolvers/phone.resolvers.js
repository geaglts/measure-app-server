import { Phone, PhoneType, Client } from "../models";

export default {
    Query: {
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
    },
    Mutation: {
        addPhone: async (obj, { phoneData }, { currentuser }) => {
            if (!currentuser) {
                return {
                    loading: false,
                };
            }

            try {
                // Ver si el telefono ya existe
                const telefonoRepetido = await Phone.findOne({
                    phone: phoneData.phone,
                });

                if (telefonoRepetido)
                    return {
                        error: "Este telefono ya esta registrado",
                        success: false,
                        loading: false,
                    };

                // Buscar el telefono principal
                await Phone.findOneAndUpdate(
                    { isMain: true },
                    { isMain: false }
                );

                const phone = new Phone({ ...phoneData, isMain: true });

                //buscar al cliente
                const client = await Client.findById(phoneData.client);
                //agregarle en nuevo telefono
                client.phones.push(phone._id);

                //guarda el telefono
                await phone.save();
                //guarda al cliente
                await client.save();

                return {
                    message: "Movil guardado con exito",
                    loading: false,
                };
            } catch (err) {
                console.log(err);

                return {
                    message: "Estoy trabajando en eso",
                    loading: false,
                };
            }
        },
        eliminarTelefono: async (obj, data, { currentuser }) => {
            try {
                if (!currentuser)
                    return {
                        loading: false,
                        error: "No autorizado",
                        success: false,
                    };

                let cliente = await Client.findById(data.clienteId);
                if (!cliente)
                    return { loading: false, error: "Cliente no encontrado" };
                cliente.phones = cliente.phones.filter(
                    (x) => x != data.telefonoId
                );
                cliente.save();
                await Phone.findByIdAndRemove(data.telefonoId);

                return {
                    message: "Eliminado correctamente",
                    loading: false,
                    success: true,
                };
            } catch (err) {
                console.log(err);
                return {
                    error: "Verifique la informacion que ingresa",
                    success: false,
                    loading: false,
                };
            }
        },
        actualizarTelefono: async (obj, data, { currentuser }) => {
            try {
                if (!currentuser)
                    return {
                        loading: false,
                        error: "No autorizado",
                        success: false,
                    };

                // Buscar el telefono y actualizar los datos
                await Phone.findByIdAndUpdate(
                    data.telefonoId,
                    {
                        ...data.datos,
                    },
                    {
                        new: true,
                    }
                );

                return {
                    message: "Actualizado correctamente",
                    loading: false,
                    success: true,
                };
            } catch (err) {
                console.log(err);
                return {
                    error: "Verifique la informacion que ingresa",
                    success: false,
                    loading: false,
                };
            }
        },
    },
    Phone: {
        phoneType: async (p) => {
            return await PhoneType.findById(p.phoneType);
        },
    },
};
