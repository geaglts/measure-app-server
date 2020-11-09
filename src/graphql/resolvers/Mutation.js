import { User, Client, Phone } from "../../models/";
import generateToken from "../../functions/generateToken";
import * as auth from "../../functions/auth";
import * as utils from "../../utils";
import * as dbUtils from "../../db-utils";

export default {
    async addClient(obj, { input }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            const userId = user._id;
            const validUser = await dbUtils.exists(["User"], {
                _id: userId,
            });
            if (!validUser) throw new Error("Este usuario no existe");

            const newInputs = utils.onlyValidateLengthAndTrimInputs(input);
            const validInputs = utils.validateObject(newInputs);

            if (validInputs) {
                const validPhoneType = await dbUtils.exists(["PhoneType"], {
                    _id: newInputs.phone.phoneType,
                });

                if (!validPhoneType)
                    throw new Error("Este tipo de telefono no es valido");

                let clientExist = await Client.findOne({
                    user: userId,
                    name: newInputs.name,
                });

                if (clientExist)
                    throw new Error("Ya cuenta con un cliente con ese nombre");

                newInputs.measures["creadoEl"] = Date.now();
                newInputs.phone["isMain"] = true;

                let client = new Client({
                    name: newInputs.name,
                    measures: newInputs.measures,
                    user: userId,
                });

                let phone = new Phone({
                    ...newInputs.phone,
                    client: client._id,
                });

                await client.save();
                await phone.save();

                return { msg: "Cliente agregado correctamente" };
            }

            throw new Error("Verifica los campos que mandas");
            // const cliente = await Client.findOne({
            //     name,
            //     user,
            // });

            // if (cliente) {
            //     return {
            //         message: "Ya hay un cliente con ese nombre",
            //         success: false,
            //         loading: false,
            //     };
            // }

            // const theUser = await User.findById(user);
            // const client = new Client({ ...input });
            // const phone = new Phone({
            //     ...phoneNumber,
            //     client: client._id,
            //     isMain: true,
            // });

            // await phone.save();
            // client.phones.push(phone);
            // await client.save();
            // theUser.clients.push(client);
            // await theUser.save();

            // return {
            //     message: "Cliente agregado con exito",
            //     loading: false,
            //     success: true,
            // };
        } catch (err) {
            throw new Error(err);
        }
    },
    async addPhoneType(parent, { type }, context) {
        try {
            let validType = utils.validateAndTrimLowerInput(type);
            if (!validType)
                throw new Error("Ingrese un tipo de telefono valido");

            return await dbUtils.newElement("PhoneType", { type });
        } catch (err) {
            throw new Error(err);
        }
    },
    /*
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
    */
    async addPhone(obj, { phoneData }, { user }) {
        try {
            if (!user) throw new Error("No authotizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(phoneData);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Verifica tus campos");

            const client = dbUtils.exists("Client", {
                _id: newInputs.clients,
                user: user._id,
            });
            if (!client)
                throw new Error("El cliente no existe o no te pertenece");

            const validPhoneType = dbUtils.exists("PhoneType", {
                _id: newInputs.phoneType,
            });
            if (!validPhoneType)
                throw new Error("Este no es un tipo de telefono valido");

            const phoneExists = await dbUtils.exists("Phone", {
                phone: newInputs.phone,
            });
            if (phoneExists) throw new Error("Este numero ya esta registrado");

            await Phone.findOneAndUpdate(
                { isMain: true },
                { isMain: false },
                { new: true }
            );

            const newPhone = new Phone({
                isMain: true,
                ...newInputs,
            });

            await newPhone.save();

            return newPhone;
        } catch (err) {
            throw new Error(err);
        }
    },
    async updatePhone(parent, { phoneData, phoneId }, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(phoneData);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Verifica tus campos");

            const validPhoneType = await dbUtils.exists("PhoneType", {
                _id: newInputs.phoneType,
            });
            if (!validPhoneType)
                throw new Error("Este no es un tipo de telefono valido");

            const phoneExists = await dbUtils.exists("Phone", {
                _id: phoneId,
                client: newInputs.client,
            });
            if (!phoneExists)
                throw new Error("Este cliente no cuenta con este telefono");

            delete newInputs["client"];
            await Phone.findByIdAndUpdate(phoneId, newInputs);

            return {
                msg: "Telefono actualizado con exito",
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    async dropPhone(parent, phoneData, { user }) {
        try {
            if (!user) throw new Error("No autorizado");
            let newInputs = utils.onlyValidateLengthAndTrimInputs(phoneData);
            let validInputs = utils.validateObject(newInputs);

            if (!validInputs) throw new Error("Verifica tus campos");

            console.log(newInputs);

            const phoneExists = await dbUtils.exists("Phone", {
                _id: newInputs.phoneId,
                client: newInputs.clientId,
            });
            console.log(phoneExists);
            if (!phoneExists)
                throw new Error("Este cliente no cuenta con este telefono");

            await Phone.findByIdAndDelete(newInputs.phoneId);
            return {
                msg: "Telefono eliminado con exito",
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    /*
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
            cliente.phones = cliente.phones.filter((x) => x != data.telefonoId);
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
    }, */
    async login(parent, args) {
        try {
            let email = utils.validateAndTrimLowerInput(args.email);

            if (!email) throw new Error("Inputs no validos");

            let userData = await User.findOne(
                { email },
                { _id: 1, email: 1, password: 1 }
            );

            if (!userData) throw new Error("Correo y/o Contraseña incorrecta");

            const passwordMatch = await auth.comparePassword(
                args.password,
                userData.password
            );

            if (!passwordMatch)
                throw new Error("Correo y/o Contraseña incorrecta");

            userData = userData.toJSON();
            delete userData.password;

            return {
                token: generateToken(userData),
            };
        } catch (err) {
            throw new Error(err);
        }
    },
    async register(parent, { input }) {
        try {
            let email = utils.validateAndTrimLowerInput(input.email);
            let password = utils.onlyValidateLength(input.password, 8);

            if (!email || !password) throw new Error("Inputs no validos");

            const userExists = await User.findOne({ email }, { _id: 1 });

            if (!userExists) {
                let passwordHash = await auth.hashPassword(password);

                await User.create({
                    email,
                    password: passwordHash,
                });

                return {
                    msg: "Cuenta creada con exito",
                };
            }

            throw new Error("Ya exsiste una cuenta con estos datos");
        } catch (err) {
            throw new Error(err);
        }
    },
};
