import {run} from "@cycle/core";
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
                    </div>
                </div>
                {boardVTree}
            </div>),
        HTTP: board.HTTP
    };
}

const drivers = {
    DOM: makeDOMDriver("#app"),
    HTTP: makeHTTPDriver()
};

run(main, drivers);
