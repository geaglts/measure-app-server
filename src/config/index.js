import { config as c } from "dotenv";
c();

import config from "./environment";

let environment;

if (process.env.NODE_ENV === "production") {
    environment = config.production;
} else {
    environment = config.development;
}

export default environment;
