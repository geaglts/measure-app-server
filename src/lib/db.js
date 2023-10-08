import mongoose from "mongoose";
import vars from "../configs/envVars";

export default mongoose
    .connect(vars.database.prodMongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("db status (conectado): ╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ");
    })
    .catch((e) => {
        console.log("db status (no conectado): ( ཀ ʖ̯ ཀ)");
    });
