import AppEnvironment from "../../Types/AppEnvironment";
import dotenv from "dotenv";

const Env: string = process.env["NODE_ENV"] || AppEnvironment.Development;

if (Env === AppEnvironment.Development || Env === AppEnvironment.Test) {
  /*
   * Load env vars from /.env, do this only on development.
   * Production values are supplied by Kubernetes Helm charts or docker compose files.
   */
  dotenv.config({
    path: "../Common/.env",
  });
  dotenv.config({
    path: "../Common/Server/.env",
  });
  dotenv.config({
    path: "./.env",
  });
}
