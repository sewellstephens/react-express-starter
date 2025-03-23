import path from "path";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import helmet from "helmet";
import https from "https";
import multer from "multer";
import { pdfToPng } from "pdf-to-png-converter";
import { errorTemplateHtml } from "./errorTemplates.js";
import rateLimit from "express-rate-limit";

import usersRoutes from "./routes/users.js";
import paymentsRoutes from "./routes/payments.js";
import teamRoutes from "./routes/team.js";
import adminRoutes from "./routes/admin.js";
import { webhook } from "./controllers/payments.js";
import { executeTokenExpire, executeUsageReset } from "./jobs/index.js";
import usageRoutes from "./routes/usage.js";
import { cookie } from "express-validator";
import { env } from 'process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import isAuth from "./middleware/isAuth.js";
import User from "./models/user.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import expressWebSockets from "express-ws";
expressWebSockets(app);

//call stripe webhook before other routes

app.post("/payments/webhook", express.raw({ type: 'application/json' }), webhook);

//helmet to secure the api

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self' app.krastie.ai api.krastie.ai"],
      scriptSrc: [`'self' app.krastie.ai api.krastie.ai`],
      styleSrc: [`'self' app.krastie.ai api.krastie.ai`],
      imgSrc: [`'self' app.krastie.ai api.krastie.ai`],
      objectSrc: [`'self' app.krastie.ai api.krastie.ai`],
      fontSrc: [`'self' app.krastie.ai api.krastie.ai`],
      upgradeInsecureRequests: [],
  },
},
}
));

//cors to allow cross-origin requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", env.FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  next();
});

//routes to other resources
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//upload file to multer
app.post("/upload", multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname + "-" + Date.now() + ".png");
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2 GB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/x-msdownload" && file.mimetype !== "application/x-msdos-program" && file.mimetype !== "application/x-executable" && file.mimetype !== "application/x-dosexec"  && file.mimetype !== "application/x-ms-dos-executable") {
      cb(null, true);
    } else {
      cb(new Error("EXE files are not allowed"));
    }
  }
}).single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    res.status(200).json({ message: "File uploaded successfully", url: `${env.BACKEND_URL}/uploads/${file.filename}` });
  } catch (error) {
    next(error);
  }
});

app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.use("/users", usersRoutes);
app.use("/payments", paymentsRoutes);
app.use("/team", teamRoutes);
app.use("/admin", adminRoutes);
app.use("/usage", usageRoutes);

//run cron jobs
cron.schedule("0 * * * *", executeTokenExpire);
cron.schedule("0 0 1 * *", executeUsageReset);
//error handling
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, errCode: status, data: data });
});

//run server
const PORT = env.PORT || 4090;

  app.listen(PORT, () => {
    console.log('✅ Server Avaliable at: ', "\x1b[34m", `http://localhost:${PORT}`);
  });


//connect to database
mongoose.connect(env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(`❌ Something went wrong`);
  console.log(`❌ Unable to connect with database`);
  console.log(`\n ${err}`);
});

db.once("open", () => {
  console.log("✅ Database connected");
});

//export app
export default app;