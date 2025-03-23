import { Duration } from "@awkewainze/simpleduration";
import { Timer } from "@awkewainze/simpletimer";
import { Context } from "koa";
import { DelayRoute } from "shared";
import { BaseHandler } from "./base";

export class DelayHandler implements BaseHandler {
    config: DelayRoute;
    constructor(config: DelayRoute) { 
        this.config = config;
    }

    async handle(ctx: Context): Promise<boolean> {
        await Timer.immediateAwaitable(Duration.fromMilliseconds(this.config.delayMs) ?? 0);
        return false;
    }
}