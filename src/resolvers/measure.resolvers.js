import { Client } from "../models";

export default {
    Mutation: {
        addMeasure: async (obj, { clientId, measures }, { currentuser }) => {
            if (!currentuser) {
                return {
                    loading: false,
                    error: "No autorizado",
                    success: false,
                };
            }

            try {
                const client = await Client.findById(clientId);

                if (client) {
                    client.measures.push({
                        ...measures,
                    });

                    await client.save();

                    return {
                        message: "Medida agregada con exito",
                        loading: false,
                        success: true,
                    };
                } else {
                    return {
                        loading: false,
                        success: false,
                        error: "Cliente no encontrado",
                    };
                }
            } catch (err) {
                return {
                    loading: false,
                    success: false,
                    error: "Verifique la informacion que ingresa",
                };
            }
        },
        deleteMeasure: async (obj, data, { currentuser }) => {
            try {
                // Verificar si el usuario inicio sesion
                if (!currentuser) {
                    return {
                        loading: false,
                        error: "No autorizado",
                        success: false,
                    };
                }

                // Obtener los datos
                const { clienteId, medidasId } = data;

                // Buscar al cliente
                let cliente = await Client.findById(clienteId);
                if (!cliente)
                    return {
                        success: false,
                        error: "No existe el cliente",
                        loading: false,
                    };

                // Verifica si hay medidas que eliminar
                if (cliente.measures.length === 0)
                    return {
                        success: false,
                        error: "No hay medidas que eliminar",
                        loading: false,
                    };

                //Eliminacion
                cliente.measures = cliente.measures.filter(
                    (medidas) => medidas.id !== medidasId
                );
                cliente.save();

                return {
                    message: "Medida eliminada con exito",
                    loading: false,
                    success: true,
                };
            } catch (err) {
                return {
                    loading: false,
                    success: false,
                    error: "Verifique la informacion que ingresa",
                };
            }
        },
        updateMeasure: async (obj, data, { currentuser }) => {
            try {
                // Verificar si el usuario inicio sesion
                if (!currentuser) {
                    return {
                        loading: false,
                        error: "No autorizado",
                        success: false,
                    };
                }

                // Obtener los datos
                const { clienteId, medidasId, medidas } = data;
                // Buscar al cliente
                let cliente = await Client.findById(clienteId);
                if (!cliente)
                    return {
                        success: false,
                        error: "No existe el cliente",
                        loading: false,
                    };

                // actualizar
                for (const index in cliente.measures) {
                    if (cliente.measures[index]._id == medidasId) {
                        cliente.measures[index] = {
                            _id: cliente.measures[index]._id,
                            height: medidas.height
                                ? medidas.height
                                : cliente.measures[index].height,
                            waist: medidas.waist
                                ? medidas.waist
                                : cliente.measures[index].waist,
                        };
                    }
                }
                cliente.save();

                return {
                    message: "Medida actualizada con exito",
                    loading: false,
                    success: true,
                };
            } catch (err) {
                console.log(err);
                return {
                    loading: false,
                    success: false,
                    error: "Verifique la informacion que ingresa",
                };
            }
        },
    },
};
