import mongoose from "mongoose";
import environment from "./config/";

const uri = environment.database_url;

export default mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("db status: :)");
    })
    .catch((e) => {
        console.log("db status: :(");
    });
