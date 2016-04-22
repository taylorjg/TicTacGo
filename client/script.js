import Rx from "rx";
import Cycle from "@cycle/core";
import {makeDOMDriver, h1} from "@cycle/dom"; 

function main() {
    return {
        DOM: Rx.Observable.interval(1000)
            .map(i => h1(`${i} seconds elapsed`))
    };
}

const drivers = {
    DOM: makeDOMDriver("#app")
};

Cycle.run(main, drivers);
