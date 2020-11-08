import { config } from "dotenv";
config();

import { genSalt, hash, compare } from "bcrypt";

export const hashPassword = async (password) => {
    return hash(password, await genSalt(10));
};

export const comparePassword = async (password, hashedPassword) => {
    return await compare(password, hashedPassword);
};
