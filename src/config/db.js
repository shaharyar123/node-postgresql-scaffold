import Sequelize from "sequelize";
import Config from "./config";

const env = process.env.NODE_ENV;

const db = new Sequelize(
  Config[env].database,
  Config[env].username,
  Config[env].password,
  {
    host: Config[env].host,
    dialect: "postgres",
    operaorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default db;
