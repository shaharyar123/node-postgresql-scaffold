import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

import connectDB from "./config/db";
import { AuthRoutes } from "../modules/index";
const port =  process.env.PORT || 8000

config();
connectDB();
const app = express();

/** Dependacy Packages  **/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Routes Definition */
app.use("/api", [AuthRoutes]);
/* Unknown Route Handler */
app.use("/", (req, res) => {
  return res.status(502).send("Bad request");
});

/***  server initialization ***/
app.listen(port, () =>
  console.log("app is listening on port " + port)
);
