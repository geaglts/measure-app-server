import mongoose from "mongoose";
export default mongoose
    .connect(process.env.DATABASE_URL, {
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
