import { config } from "dotenv";
config();

import { User } from "../models";

import { genSalt, hash, compare } from "bcrypt";
import { verify, decode } from "jsonwebtoken";

export const hashPassword = async (password) => {
    return hash(password, await genSalt(10));
};

export const comparePassword = async (password, hashedPassword) => {
    return await compare(password, hashedPassword);
};

export const isAuthenticated = async function ({ req }) {
    let token = null;
    let currentuser = null;

    token = req.headers["authorization"];

    if (!token) return {};

    const decodedInfo = verify(token, process.env.JWT_SECRET);

    if (!decodedInfo) return {};

    if (token && decodedInfo) {
        const id = decodedInfo.data;
        currentuser = await User.findById(id);
        if (!currentuser) throw new Error("Token invalido");
    }

    return {
        token,
        currentuser,
    };
};
