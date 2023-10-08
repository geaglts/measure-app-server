import { config } from "dotenv";

config();

const envVars = {
    app: {
        nodeEnv: process.env.NODE_ENV || "development",
        isDev: process.env.NODE_ENV === "development",
        port: process.env.PORT || 3001,
    },
    database: {
        prodMongoUri: process.env.MONGO_DB_URI,
    },
    auth: {
        apiKey: process.env.API_KEY,
        jwtSecret: process.env.JWT_SECRET,
    },
};

export default envVars;
