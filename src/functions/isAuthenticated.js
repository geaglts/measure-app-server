import verify from "jsonwebtoken/verify";

export default async function ({ req }) {
    const { headers } = req;

    if (!headers?.authorization) return {};

    const user = verify(headers.authorization, process.env.JWT_SECRET);
    if (!user) return {};

    return {
        user,
    };
}
