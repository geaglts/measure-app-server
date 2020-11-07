import { config } from "dotenv";
config();

export default {
    production: {
        database_url: process.env.DATABASE_URL,
    },
    development: {
        database_url: "mongodb://localhost/measure-db",
    },
};
