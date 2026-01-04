import { errorResponse } from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";


// const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token)
        //TODO: ensure token after postman checking and uncomment this
        // const token = req.headers.authorization?.split(" ")[1]; //this is for postman
        // console.log("Token from cookies: ", token);
        
        const JWT_SECRET = process.env.JWT_SECRET_KEY;
        if(!token){
            return errorResponse(res, 401, "Unauthorized access");
            // return successResponse(res, 401, "Unauthorized access");
        }
        const decodedToken = jwt.verify(token, JWT_SECRET);
        console.log(decodedToken)
        if(!decodedToken.userId){
            return errorResponse(res, 401, "Access denied");
        }


        // check generateToken for more info
        req.userId = decodedToken.userId;
        req.role = decodedToken.role;
        next();
    } catch (error) {
        errorResponse(res, 500, "Failed to verify token", error);
    }
}


export default verifyToken;