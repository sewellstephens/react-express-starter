import User from "../models/user.js";
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();

const ONE_HOUR = 3600000;

const deleteInactiveUsers = async () => {
  try {
    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const currentDate = new Date();
      const userDate = new Date(user.updatedAt);
      const diff = currentDate - userDate;
      if (diff > ONE_HOUR) {
        user.activationToken = null;
        await user.save();
      }
    }
  } catch (err) {
    console.log(`${err.message}`);
  }
};

export default deleteInactiveUsers;