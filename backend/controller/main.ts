import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

import { Request, Response } from "express";
import findUserEmail from "../config/findUserEmail";
import pool from "../config/neon";
import verifyPassword from "../config/verfiyPassword";
import { createUser } from "../model/createUser";
import jwt from "../config/jwt";
import validator from "validator";

let auth = {
    register: async (req:Request, res:Response) => {
        try {
            const { email,firstName, password, lastName, confirmPassword, timezone} = req.body;
            const doesEmailExist = await  findUserEmail(email);
            if(doesEmailExist){
                res.status(400).send({status:"400", error:"email already in use"})
            } else if(!email || !password || !firstName|| !lastName ){
                res.status(400).send({status:"400", error:"missing fields in form"})
            } else if (password !== confirmPassword) {
                // add validator.isStrongPassword(password) in the future
                // if (!validator.isStrongPassword(password, { minLength: 8 })) {
                //     return res.status(400).json({ error: "Password too weak" });
                // }
                res.status(400).send({status:"400", error:"passwords do not match"})
            } else if(!validator.isEmail(email)){
                res.status(400).send({status:"400", error:"invalid email"})
            } else {
                const user = await createUser(firstName, lastName, email, password, timezone);
                res.status(201).send({status:"201", message:"user signed up successfully"})
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: '500', error: 'Internal server error' });
        }
    },
    login: async (req:Request, res:Response) => {
        try {
            const { email, password } = req.body;
            const user = await findUserEmail(email);
            
            if(!user) {
                return res.status(400).send({status:"400", error:"email not found"})
            } 
            const verified = await verifyPassword(user.password, password);
            if( !email || !password){
                res.status(400).send({status:"400", error:"missing fields in form"})
            } else if(!user){
                res.status(400).send({status:"400", error:"email address not found"})
            } else if (!verified){
                res.status(400).send({status:"400", error:"incorrect password"})
            } else {
                const token = jwt(user.id);

                res.cookie("access_token", token, {
                    httpOnly: true, 
                    secure: false, // process.env.NODE_ENV === "production", // only HTTPS in production
                    sameSite: "strict", 
                    maxAge: 1000 * 60 * 60, 
                });

                res.status(200).send({ status: '200', message: 'user signed in successfully' });
                
            } 
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: '500', error: 'Internal server error' });
        }
    },
    logout: async (req:Request, res:Response) => {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).send({ message: "Logged out successfully" });
    },
    getProfile: async (req:Request, res:Response) => {
        try {
            // this is the login user (req as any).user.sub) code
            
            const getUser = await pool.query('SELECT * FROM users WHERE id = $1', [(req as any).user.sub]);
            
            res.json({ message: "Welcome back! " + getUser.rows[0].firstname, user: getUser.rows[0] });
          
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: '500', error: 'Internal server error' });
        }
      }
}
export default auth

