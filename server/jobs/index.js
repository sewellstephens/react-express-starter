import mongoose from "mongoose";
import cron from "node-cron";
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();

import deleteInactiveUsers from "./tokenExpire.js";
import resetUsage from "./resetUsage.js";

const executeTokenExpire = async () => {
  console.log("Setup database connection");
  mongoose
    .connect(
      env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
      console.log("✅ Database connected.");

      // Running jobs
      await deleteInactiveUsers();
      
    })
    .catch((err) => {
      console.log(`❌ Unable to connect to database: ${err.message}`);
    });
};

const executeUsageReset = async () => {
  mongoose
    .connect(
      env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
      console.log("✅ Database connected.");

      // Running jobs
      await resetUsage();

    })
    .catch((err) => {
      console.log(`❌ Unable to connect to database: ${err.message}`);
    });
}

const executeCsv = async () => {
  mongoose
    .connect(
      env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
      console.log("✅ Database connected.");

      // Running jobs
      await convertToCsv();

    })
    .catch((err) => {
      console.log(`❌ Unable to connect to database: ${err.message}`);
    });
}

export {
    executeTokenExpire,
    executeUsageReset,
    executeCsv,
};