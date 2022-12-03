import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/ioredis";
import {config} from "./config";
import * as rest from "./controllers/rest";
import { envs, isProduction } from "./config/envs";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: isProduction ? 8084 : 8085,
  componentsScan: false,
  mount: {
    "/rest": [
      ...Object.values(rest)
    ]
  },
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ],
  ioredis: [
    {
      name: "default",
      host: envs.REDIS_HOST,
      port: Number(envs.REDIS_PORT || 6379),
      username: envs.REDIS_USERNAME,
      password: envs.REDIS_PASSWORD,
      tls: isProduction ? {} : undefined
    }
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
