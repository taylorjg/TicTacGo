import Rx from "rx";
import Cycle from "@cycle/core";
import {makeDOMDriver, hJSX} from "@cycle/dom";

function intent(sources) {
    const actions = {
        // TODO
    };
    return actions;
} 

function model(actions) {
    const state$ = Rx.Observable.of({
        // TODO
    });
    return state$;
} 

function view(state$) {
    const sinks = state$.map(state =>
        <div className="container">
            <div className="row">
                <div className="col-md-offset-4 col-md-4">
                    <h1>Tic-Tac-Toe</h1>
                    <table id="board">
                        <tbody>
                            <tr className="thickBottom">
                                <td id="cell00" className="thickRight"></td>
                                <td id="cell01" className="thickRight"></td>
                                <td id="cell02"></td>
                            </tr>
                            <tr className="thickBottom">
                                <td id="cell10" className="thickRight"></td>
                                <td id="cell11" className="thickRight"></td>
                                <td id="cell12"></td>
                            </tr>
                            <tr>
                                <td id="cell20" className="thickRight"></td>
                                <td id="cell21" className="thickRight"></td>
                                <td id="cell22"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
    return sinks;
} 

function main(sources) {
    return {
        DOM: view(model(intent(sources))) 
    };
}

const drivers = {
    DOM: makeDOMDriver("#app")
};

Cycle.run(main, drivers);
