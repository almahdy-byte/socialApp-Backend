import express from "express";
import { bootstrap } from "./src/app.controller.js";
import dotenv from "dotenv";
const app = express();



bootstrap(app, express);


// Start the server
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});