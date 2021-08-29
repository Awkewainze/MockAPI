import { Context } from "koa";
import { StaticRoute } from "shared";
import { BaseHandler } from "./base";

export class StaticHandler implements BaseHandler {
    config: StaticRoute;
    constructor(config: StaticRoute) { 
        this.config = config;
    }

    async handle(ctx: Context): Promise<boolean> {
        ctx.response.body = this.config.body;
        ctx.response.status = this.config.statusCode ?? 200;
        for (const header in this.config.headers) {
            ctx.response.set(header, this.config.headers[header]);
        }
        return true;
    }
}