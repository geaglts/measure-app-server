import jwt from "jsonwebtoken";
import envVars from "../configs/envVars";
import { User } from "../models";

export default async function ({ req }) {
    const { headers } = req;
    const token = headers?.authorization;
    if (!token) return {};
    const { _id } = jwt.verify(token, envVars.auth.jwtSecret);
    const user = await User.findOne({ _id, "tokens.token": token });
    if (!user) return {};
    return { user, token };
}
