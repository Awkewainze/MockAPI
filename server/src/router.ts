import { Check } from "@awkewainze/checkverify";
import { Context } from "koa";
import { DelayRoute, HTTPMethod, ProxyRoute, Route, RouteRequestRequirements, RouteType, StaticRoute } from "shared";
import { BaseHandler, DelayHandler, ProxyHandler, StaticHandler } from "./route-handlers";

export class Router {
    private readonly _routeWrappers: {
        route: Route,
        handler: BaseHandler,
        iterations: number
    }[];
    constructor(routes: Route[]) {
        this._routeWrappers = routes.map(route => ({ route, handler: Router.createHandlerFromRoute(route), iterations: 0 }));
    }

    public async handle(ctx: Context): Promise<void> {
        for (const wrapper of this._routeWrappers) {
            if (this.checkRequestRequirements(ctx, wrapper.route.requestRequirements)) {
                wrapper.iterations++;
                if ((wrapper.route.skip && wrapper.route.skip <= wrapper.iterations)
                    || (wrapper.route.take && (wrapper.route.skip ?? 0) + wrapper.route.take > wrapper.iterations)) {
                    continue;
                }
                if (await wrapper.handler.handle(ctx)) return;
            }
        }
    }

    // TODO check body and headers
    private checkRequestRequirements(ctx: Context, rr: RouteRequestRequirements): boolean {
        return RegExp(rr.route).test(ctx.url)
            && (Check.isNullOrUndefined(rr.methods) || rr.methods!.includes(ctx.method as HTTPMethod));
    }

    private static createHandlerFromRoute(route: Route): BaseHandler {
        switch (route.type) {
            case RouteType.Delay:
                return new DelayHandler(route as DelayRoute);
            case RouteType.Static:
                return new StaticHandler(route as StaticRoute);
            case RouteType.Proxy:
                return new ProxyHandler(route as ProxyRoute);
            default:
                throw new Error(`Unsupported route type: ${route.type}`);
        }
    }
}
