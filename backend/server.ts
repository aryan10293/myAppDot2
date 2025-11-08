import express, { Router } from "express";
import http from "http";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongo";
import flash from "express-flash";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import pool from "./config/neon";
import createTables from "./model/users";
import * as bodyParser from 'body-parser';
import WebSocket, { WebSocketServer } from 'ws';
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const MongoStore = connectMongo(session);

let router: Router = express.Router();
router.use(bodyParser.text());


import mainRoutes from "./routes/main";


app.use(express.urlencoded({ extended: true}));
app.use(express.json({limit: '50mb'}));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(logger("dev"));

app.use(cookieParser("keyboard cat"));



app.use(flash());

app.use("/", mainRoutes);


createTables();
server.listen(process.env.PORT || 2040, () => {
  console.log(`Server is running, you better catch it! on http://localhost:${process.env.PORT || 2040}`);
});