

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import imageRouter from "./routes/generatror.routes.js";

dotenv.config({ path: "./.env" });
const app = express();
const port =  process.env.PORT || 5000;




app.use(
    cors({
    origin: [ process.env.CORS_ORIGIN || "*" ], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Request-With",
    ],
    })
    );
app.use(bodyParser.json());


app.use("/api/generate-image",imageRouter)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});