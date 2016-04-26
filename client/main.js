import {Observable} from "rx";
import {run} from "@cycle/core";
import {makeDOMDriver, hJSX} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import isolate from "@cycle/isolate";
import TicTacToe from "./TicTacToe";

function main(sources) {
    const ticTacToe1 = isolate(TicTacToe)(sources);
    const ticTacToe2 = isolate(TicTacToe)(sources);
    return {
        DOM: Observable.combineLatest(ticTacToe1.DOM, ticTacToe2.DOM, (vtree1, vtree2) =>
            <div className="container">
                <div className="row">
                    <div className="col-md-offset-4 col-md-4">
                        <h1>Tic-Tac-Go</h1>
                    </div>
                </div>
                {vtree1}
                <hr />
                {vtree2}
            </div>),
        HTTP: Observable.merge(ticTacToe1.HTTP, ticTacToe2.HTTP)
    };
}

const drivers = {
    DOM: makeDOMDriver("#app"),
    HTTP: makeHTTPDriver()
};

run(main, drivers);
