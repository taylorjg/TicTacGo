import {Observable} from "rx";
import {run} from "@cycle/core";
import {makeDOMDriver, hJSX} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import isolate from "@cycle/isolate";
import TicTacToe from "./Components/TicTacToe/TicTacToe";

function main(sources) {
    const init$ = Observable.timer(0);
    const props1$ = Observable.just({ firstTabIndex: 1000, initialFocus: true });
    const props2$ = Observable.just({ firstTabIndex: 1100, initialFocus: false });
    const ticTacToe1 = isolate(TicTacToe)(sources, init$, props1$);
    const ticTacToe2 = isolate(TicTacToe)(sources, init$, props2$);
    return {
        DOM: Observable.combineLatest(ticTacToe1.DOM, ticTacToe2.DOM, (vtree1, vtree2) =>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">{vtree1}</div>
                    <div className="col-md-6">{vtree2}</div>
                </div>
            </div>),
        HTTP: Observable.merge(ticTacToe1.HTTP, ticTacToe2.HTTP),
        SetFocus: Observable.merge(ticTacToe1.SetFocus, ticTacToe2.SetFocus)
    };
}

const drivers = {
    DOM: makeDOMDriver("#app"),
    HTTP: makeHTTPDriver(),
    SetFocus: function(id$) {    
        id$.subscribe(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.focus();
            }
        });
        const source = Observable.empty();
        source.isolateSource = s => s;
        return source;
    }    
};

run(main, drivers);
