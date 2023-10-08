import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envVars from "../configs/envVars";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate(value) {
                const regExp = /\s/;
                if (value.match(regExp)) {
                    throw new Error(
                        "El nombre de usuario no puede tener espacios."
                    );
                }
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
    }
    next();
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const data = { _id: user._id.toString() };
    const tokenConfigs = { expiresIn: "24h" };
    const token = jwt.sign(data, envVars.auth.jwtSecret, tokenConfigs);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (userName, password) => {
    const user = await userModel.findOne({ userName });
    if (!user) throw new Error("Datos incorrectos.");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Datos incorrectos.");
    return user;
};

const userModel = model("User", userSchema, "users");

export default userModel;
