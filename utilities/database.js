import fs from "fs";
import Sequelize from "sequelize";
import { username, password, host, port, database, path } from "./constants.js";
let sequelizeOptions;
console.log("Process.env.Node=",process.env.NODE_ENV)
if (process.env.NODE_ENV !== "DEV") {

  const ca = fs.readFileSync(path)?.toString();
  sequelizeOptions = {
    dialect: "mysql",
    username,
    password,
    host,
    port,
    database,
    dialectOptions: {
      ssl: {
        ca,
      },
    },
    logging: false,
  };
}
else {

  sequelizeOptions = {
    dialect: "mysql",
    username,
    password,
    host,
    port,
    database,
    logging: false,
  };
}

const sequelizeConn = new Sequelize(sequelizeOptions);
export default sequelizeConn;
