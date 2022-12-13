import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import { isProduction } from "../../config/envs";

@Controller("/hello-world")
export class HelloWorldController {
  @Get("/")
  public get(): Record<string, any> {
    return {
      message: "hello world",
      env: isProduction ? {
        ...process.env,
        ...{
          REDIS_USERNAME: process.env.REDIS_USERNAME ? '****' : 'not available',
          REDIS_PASSWORD: process.env.REDIS_PASSWORD ? '****' : 'not available',
          REDIS_HOST: process.env.REDIS_HOST,
          REDIS_PORT: process.env.REDIS_PORT
        }
      } : process.env
    };
  }
}
