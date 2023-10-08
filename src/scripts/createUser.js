import { config } from "dotenv";
import { User } from "../models/";
import "../lib/db";

config();

async function main() {
    try {
        const usersSize = await User.countDocuments();
        if (usersSize === 0) {
            const newUser = new User({
                userName: process.env.USER_NAME,
                password: process.env.USER_PASSWORD,
            });
            await newUser.save();
            console.log("Usuario creado correctamente");
        } else {
            console.log("Ya fue creado un usuario previamente");
        }
    } catch (e) {
        console.log(e.message);
    } finally {
        process.exit(0);
    }
}

main();
