import * as Models from "./models";

export async function exists(modelName, search) {
    try {
        let quantity = await Models[modelName].countDocuments(search);
        return quantity > 0;
    } catch (err) {
        throw new Error("ID no valido");
    }
}

export async function newElement(modelName, attributes) {
    try {
        return await Models[modelName].create(attributes);
    } catch (err) {
        throw new Error("ID no valido");
    }
}
