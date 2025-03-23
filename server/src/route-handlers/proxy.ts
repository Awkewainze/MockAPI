import { Context } from "koa";
import proxy from "koa-proxy";
import { ProxyRoute } from "shared";
import { BaseHandler } from "./base";

export class ProxyHandler implements BaseHandler {
    private readonly proxyHandler = proxy({
        host: this.config.proxyUrl
    });
    constructor(public config: ProxyRoute) {}

    async handle(ctx: Context): Promise<boolean> {
        return new Promise(resolve => {
            this.proxyHandler(ctx, async () => {
                resolve(true);
            });
        });
    }
}