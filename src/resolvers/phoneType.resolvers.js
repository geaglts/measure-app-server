import { PhoneType } from "../models";

export default {
    Query: {
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
    },
    Mutation: {
        newPhoneType: async (obj, { type }) => {
            try {
                //campos verificados
                const verifiedType = type.trim().toLowerCase();

                //validacion de inputs
                const valid_type = verifiedType.length > 0;

                if (!valid_type) {
                    return {
                        message: "El campo no debe estar vacio",
                        loading: false,
                    };
                }

                //verifica si ya existe un tipo igual
                const typeExists = await PhoneType.findOne({
                    type: verifiedType,
                });

                if (typeExists) {
                    return {
                        message: "Ese tipo de telefono ya esta registrado",
                        loading: false,
                    };
                } else {
                    const newPhoneType = new PhoneType({ type: verifiedType });

                    await newPhoneType.save();

                    return {
                        message: "Registro guardado con exito",
                        loading: false,
                    };
                }
            } catch (err) {
                return {
                    message: "Estoy trabajando en eso",
                    loading: false,
                };
            }
        },
        updatePhoneType: async (obj, { id, type }) => {
            try {
                //campos verificados
                const verifiedType = type.trim().toLowerCase();

                //validacion de inputs
                const valid_type = verifiedType.length > 0;

                if (!valid_type) {
                    return {
                        message: "el campo no puede estar vacio",
                        loading: false,
                    };
                }

                await PhoneType.findByIdAndUpdate(id, { type: verifiedType });

                return {
                    message: "Registro actualizado con exito",
                    loading: false,
                };
            } catch (err) {
                return {
                    message: "Estoy trabajando en eso",
                    loading: false,
                };
            }
        },
        deletePhoneType: async (obj, { id }) => {
            try {
                //verifica el id
                const verifiedId = id.trim().length > 0;

                let message = "";

                if (verifiedId) {
                    await PhoneType.findByIdAndDelete(id.trim());

                    message = "Eliminado con exito";
                } else {
                    message = "El id no es valido";
                }

                return {
                    message,
                    loading: false,
                };
            } catch (err) {
                return {
                    message: "Verifique su informacion",
                    loading: false,
                };
            }
        },
    },
};
