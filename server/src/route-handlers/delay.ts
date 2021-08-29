import { Context } from "koa";
import { DelayRoute } from "shared";
import { BaseHandler } from "./base";

export class DelayHandler implements BaseHandler {
    config: DelayRoute;
    constructor(config: DelayRoute) { 
        this.config = config;
    }

    handle(ctx: Context): Promise<boolean> {
        return new Promise(resolve => setTimeout(() => {
            resolve(false);
        }, this.config.delayMs ?? 0));
    }
}