import { Context } from "koa";
import { Route } from "shared";

export interface BaseHandler {
    config: Route;
    /**
     * @param {Context} ctx
     * @returns {Promise<void>} `true` if request was handled, `false` otherwise.
     */
    handle(ctx: Context): Promise<boolean>;
}