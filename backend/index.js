import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import baseUrl from "./src/utils/baseUrl.js";

// env
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();


// middleware
app.use(express.json({ limit: '25mb' }));
app.use(cors(
  {
    origin: baseUrl,
    credentials: true,
  }
));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));



// routes path import
import productRoutes from "./src/products/product.route.js"
import userRoutes from "./src/users/user.routes.js"
import reviewRoutes from "./src/reviews/review.route.js"
import orderRoutes from "./src/orders/order.route.js"
import statsRoutes from "./src/stats/stats.route.js"
import { UploadImage } from "./src/utils/uploadImage.js";
import { errorResponse, successResponse } from "./src/utils/responseHandler.js";

// routes
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);


async function main() {
  await mongoose.connect(process.env.DB_URL);


  app.get("/", (req, res) => {
    res.send("Lebaba E-commerce backend started");
})
}
main().then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// upload image API
app.post('/upload-image', async (req, res) => {
    try {
        const url = await UploadImage(req.body.image);
        return successResponse(res, 200, "Successfully uploaded image", url);
    } catch (err) {
        console.error("Upload Error:", err);
        return errorResponse(res, 500, "Failed to upload image", err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});