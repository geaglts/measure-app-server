import verify from "jsonwebtoken/verify";

export default async function ({
    req: {
        headers: { authorization },
    },
}) {
    if (!authorization) return {};

    const user = verify(authorization, process.env.JWT_SECRET);
    if (!user) return {};

    return {
        user,
    };
}
