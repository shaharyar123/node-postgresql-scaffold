import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

import db from "./config/db";
import { associateModels } from "./models";
import { AuthRoutes } from "../modules";

config();
const app = express();

db.authenticate()
  .then(() => {
    console.log("connected to database successfully!");
    associateModels();
  })
  .catch((error) => console.log("Failed to connect with database.", error));

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
app.listen(process.env.PORT, () =>
  console.log("app is listening on port " + process.env.PORT)
);
