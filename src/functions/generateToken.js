import { sign } from "jsonwebtoken";

export default (data) => {
    return sign(data, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 100,
    });
};
