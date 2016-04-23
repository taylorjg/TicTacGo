import Rx from "rx";
import Cycle from "@cycle/core";
import {makeDOMDriver, hJSX} from "@cycle/dom";

function intent(sources) {
    const actions = {
        cellSelected$: sources.DOM.select(".cell").events("click")
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id])
    };
    return actions;
}

const EMPTY_V = 0;
const CROSS_V = 1;
const NOUGHT_V = 2;

const EMPTY_S = "";
const CROSS_S = "X"; 
const NOUGHT_S = "O"; 

const IDS_TO_CELL_INDICES = {
    "cell00": 0,
    "cell01": 1,
    "cell02": 2,
    "cell10": 3,
    "cell11": 4,
    "cell12": 5,
    "cell20": 6,
    "cell21": 7,
    "cell22": 8
}; 

function model(actions) {
    
    function seedState() {
        return {
            cells: [
                EMPTY_V, EMPTY_V, EMPTY_V,
                EMPTY_V, EMPTY_V, EMPTY_V,
                EMPTY_V, EMPTY_V, EMPTY_V]
        };
    }
    
    const humanMove$ = actions.cellSelected$.map(cellIndex => {
        return function(state) {
            if (state.cells[cellIndex] !== EMPTY_V) {
                return state;
            }
            const newCells = state.cells.slice();
            newCells[cellIndex] = CROSS_V;
            const newState = {
                cells: newCells
            };
            return newState;
        }
    });
    
    const transform$ = Rx.Observable.merge(humanMove$); 
    
    const state$ = transform$
        .startWith(seedState())
        .scan((state, transform) => transform(state));
        
    return state$;
}

function cellString(state, index) {
    switch (state.cells[index]) {
        case CROSS_V:
            return CROSS_S;
        case NOUGHT_V:
            return NOUGHT_S;
        default:
            return EMPTY_S;
    } 
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
                                <td id="cell00" className="cell thickRight">{cellString(state, 0)}</td>
                                <td id="cell01" className="cell thickRight">{cellString(state, 1)}</td>
                                <td id="cell02" className="cell">{cellString(state, 2)}</td>
                            </tr>
                            <tr className="thickBottom">
                                <td id="cell10" className="cell thickRight">{cellString(state, 3)}</td>
                                <td id="cell11" className="cell thickRight">{cellString(state, 4)}</td>
                                <td id="cell12" className="cell">{cellString(state, 5)}</td>
                            </tr>
                            <tr>
                                <td id="cell20" className="cell thickRight">{cellString(state, 6)}</td>
                                <td id="cell21" className="cell thickRight">{cellString(state, 7)}</td>
                                <td id="cell22" className="cell">{cellString(state, 8)}</td>
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
