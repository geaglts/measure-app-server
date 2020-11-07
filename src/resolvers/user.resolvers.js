import { hashPassword, comparePassword } from "../functions/auth";
import { signData } from "../functions/token";
import { User, Client } from "../models/";

export default {
    Query: {
        getUser: async (obj, data, { currentuser }) => {
            try {
                if (!currentuser) {
                    return { loading: false };
                }

                const user = await User.findById(currentuser.id);

                return {
                    userData: user,
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
        login: async (obj, { input }) => {
            try {
                //email
                const email = input.email.trim().toLowerCase();

                //validacion de inputs
                const email_valid = input.email.trim().length > 0;
                const password_valid = input.password.length > 0;

                if (!email_valid || !password_valid) {
                    return {
                        message: "No puede haber campos vacios",
                        loading: false,
                    };
                }

                const userExists = await User.findOne({ email });

                let message = "";

                if (!userExists) {
                    message = "Usuario y/o Contraseña incorrecto";
                } else {
                    const match = await comparePassword(
                        input.password,
                        userExists.password
                    );

                    if (match) {
                        //generar el token
                        const token = signData(userExists._id);
                        userExists.token = token;
                        await userExists.save();

                        return {
                            message: "Bienvenido",
                            user: userExists,
                            loading: false,
                        };
                    } else {
                        message = "Usuario y/o Contraseña incorrecto";
                    }
                }

                return {
                    message,
                    loading: false,
                };
            } catch (error) {
                console.log(error);

                return {
                    message: "Verifique su informacion",
                    loading: false,
                };
            }
        },
        register: async (obj, { input }) => {
            try {
                //email
                const email = input.email.trim().toLowerCase();

                //validacion de inputs
                const email_valid = input.email.trim().length > 0;
                const password_valid = input.password.length > 0;

                if (!email_valid || !password_valid) {
                    return {
                        message: "No puede haber campos vacios",
                        loading: false,
                    };
                }

                //verifica si ya existe un email igual
                const userExists = await User.findOne({ email });

                if (userExists) {
                    return {
                        message: "Ya hay un usuario con esa informacion",
                        loading: false,
                    };
                } else {
                    //genera la password hasheada y agrega al usuario
                    const password = await hashPassword(input.password);
                    input = {
                        email,
                        password,
                    };

                    await User.create(input);

                    return {
                        message: "Registro exitoso",
                        loading: false,
                    };
                }
            } catch (error) {
                return {
                    message: "Verifique su informacion",
                    loading: false,
                };
            }
        },
    },
    User: {
        clients: async (u) => {
            return await Client.find({ user: u.id });
        },
    },
};
