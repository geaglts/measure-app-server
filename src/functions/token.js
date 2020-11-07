import { config } from "dotenv";
config();

import { sign } from "jsonwebtoken";

export const signData = (data) => {
    return sign({ data }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 100,
    });
};
