import nodemailer from "nodemailer";
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();

const transport = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
});

export default transport;