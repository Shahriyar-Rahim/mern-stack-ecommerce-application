import User from "../users/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateTocken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user) {
            throw new Error("User not found");
        }

        const tocken = jwt.sign({userId: user._id, role: user.role}, JWT_SECRET, {expiresIn: "1h"});
        return tocken;

    } catch (error) {
        console.error({
            message: "Error generating tocken",
            error
        })
        throw error;
    }
}

export default generateTocken;