import { errorResponse } from "../utils/responseHandler.js";

const verifyAdmin = (req, res, next) => {
    if(req.role !== 'admin'){
        return errorResponse(res, 403, "Unauthorized access");
    }
    next();
}


export default verifyAdmin