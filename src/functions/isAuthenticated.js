import verify from "jsonwebtoken/verify";
import { User } from "../models";

export default async function ({ req }) {
    const { headers } = req;
    const token = headers?.authorization;

    if (!token) return {};
    const { _id } = verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id, "tokens.token": token });

    if (!user) return {};

    return {
        user,
        token,
    };
}
