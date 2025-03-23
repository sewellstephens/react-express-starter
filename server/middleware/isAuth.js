import jwt from "jsonwebtoken";
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();

// Since public pages can be retrieved by anybody, we don't throw any errors
// in the authentication middleware. We have further authorization checks when
// we load the page from the database.

export default (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, env.JWT_KEY);
    req.userId = userId;
  }
  next();
};