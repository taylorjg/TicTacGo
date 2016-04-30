import {Observable} from "rx";
import {run} from "@cycle/core";
import {makeDOMDriver, hJSX} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import isolate from "@cycle/isolate";
import TicTacToe from "./Components/TicTacToe/TicTacToe";

function main(sources) {
    const init$ = Observable.timer(0);
    const ticTacToe1 = isolate(TicTacToe)(sources, init$);
    const ticTacToe2 = isolate(TicTacToe)(sources, init$);
    return {
        DOM: Observable.combineLatest(ticTacToe1.DOM, ticTacToe2.DOM, (vtree1, vtree2) =>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">{vtree1}</div>
                    <div className="col-md-6">{vtree2}</div>
                </div>
            </div>),
        HTTP: Observable.merge(ticTacToe1.HTTP, ticTacToe2.HTTP)
    };
}

const drivers = {
    DOM: makeDOMDriver("#app"),
    HTTP: makeHTTPDriver()
};

run(main, drivers);
