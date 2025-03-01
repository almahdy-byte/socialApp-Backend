import express from "express";
import { bootstrap } from "./src/app.controller.js";
import dotenv from "dotenv";
import { serverConnection } from "./src/modules/socketModule/socket.controller.js";
dotenv.config();
const app = express();



bootstrap(app, express);


// Start the server
const server = app.listen(process.env.PORT, () => {console.log("Server is running on port 3000");});

serverConnection(server);