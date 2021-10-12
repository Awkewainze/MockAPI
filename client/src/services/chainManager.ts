import { Observable, Subject } from "rxjs";
import { Route } from "shared";

export class ChainManager {
    private constructor() {}
    private static instance: ChainManager;
    static getInstance(): ChainManager {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    private routeChain: ReadonlyArray<Readonly<Route>> = [];
    private selectedRouteIndex: number | null = null;

    get Chain(): ReadonlyArray<Readonly<Route>> {
        return Array.from(this.routeChain);
    }

    get SelectedRouteIndex(): number | null {
        if (this.selectedRouteIndex === null) return null;
        if (this.routeChain.length === 0) return null;
        if (this.selectedRouteIndex >= this.routeChain.length) {
            this.selectedRouteIndex = 0;
        }

        return this.selectedRouteIndex;
    }

    get SelectedRoute(): Readonly<Route> | null {
        if (this.SelectedRouteIndex === null) return null;

        return this.routeChain[this.SelectedRouteIndex]
    }

    private readonly chainSubject: Subject<ReadonlyArray<Readonly<Route>>> = new Subject();
    get ChainObservable(): Observable<ReadonlyArray<Route>> {
        return this.chainSubject.asObservable();
    }

    private readonly routeSubject: Subject<Readonly<Route>> = new Subject();
    get RouteObservable(): Observable<Readonly<Route>> {
        return this.routeSubject.asObservable();
    }

    set Chain(chain: ReadonlyArray<Readonly<Route>>) {
        this.routeChain = Array.from(chain);
        this.chainSubject.next(chain);
    }

    set SelectedRouteIndex(index: number | null) {
        this.selectedRouteIndex = index;
    }
}