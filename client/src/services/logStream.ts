import { Duration } from "@awkewainze/simpleduration";
import { Timer } from "@awkewainze/simpletimer";
import { DateTime } from "luxon";

export interface LogEvent {
    from: "Server" | "Client";
    error?: Error;
    dateTime: DateTime;
    text: string;
};

export class LogStreamService {
    private static instance: LogStreamService;
    private constructor(){
    }
    static getInstance(): LogStreamService {
        if (!this.instance) {
            this.instance = new this();
        }
        this.instance.generateMockStreamData();
        return this.instance;
    }

    private listeners: Array<(event: LogEvent) => void> = [];
    sendEvent(event: Omit<LogEvent, "dateTime">) {
        const eventWithCurrentTime = {
            ...event,
            dateTime: DateTime.now()
        };
        this.listeners.forEach(listener => listener(eventWithCurrentTime));
    }

    listen(listener: (event: LogEvent) => void): (event: LogEvent) => void {
        this.listeners.push(listener);
        return listener;
    }

    removerListener(listener: (event: LogEvent) => void) {
        this.listeners = this.listeners.filter(x => x !== listener);
    }

    private randomSentence(): string {
        var nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
        var verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
        var adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
        var adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
        var preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

        var rand1 = Math.floor(Math.random() * 10);
        var rand2 = Math.floor(Math.random() * 10);
        var rand3 = Math.floor(Math.random() * 10);
        var rand4 = Math.floor(Math.random() * 10);
        var rand5 = Math.floor(Math.random() * 10);
        var rand6 = Math.floor(Math.random() * 10);
        return "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
    }

    private async generateMockStreamData() {
        for (let index = 0; index < 50; index++) {
            this.sendEvent({ from: Math.floor(Math.random() * 2) === 0 ? "Client" : "Server", text: this.randomSentence() })
            await Timer.immediateAwaitable(Duration.fromSeconds(3));
        }
    }
}