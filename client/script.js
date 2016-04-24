import Rx from "rx";
import Cycle from "@cycle/core";
import {makeDOMDriver, hJSX} from "@cycle/dom";
import {makeHTTPDriver} from "@cycle/http";
import Board from "./board";

function main(sources) {
    const board = Board(sources);
    const boardVTree$ = board.DOM; 
    return {
        DOM: boardVTree$.map(boardVTree =>
            <div className="container">
                <div className="row">
                    <div className="col-md-offset-4 col-md-4">
                        <h1>Tic-Tac-Toe</h1>
                        {boardVTree}
                    </div>
                </div>
            </div>),
        HTTP: board.HTTP
    };
}

const drivers = {
    DOM: makeDOMDriver("#app"),
    HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);
