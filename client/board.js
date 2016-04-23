import Rx from "rx";
import {hJSX} from "@cycle/dom";

const EMPTY_VALUE = 0;
const CROSS_VALUE = 1;
const NOUGHT_VALUE = 2;

const EMPTY_STRING = "";
const CROSS_STRING = "X"; 
const NOUGHT_STRING = "O"; 

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

function cellContents(state, index) {
    switch (state.cells[index]) {
        case CROSS_VALUE:
            return CROSS_STRING;
        case NOUGHT_VALUE:
            return NOUGHT_STRING;
        default:
            return EMPTY_STRING;
    } 
} 

function intent(sources) {
    const actions = {
        cellSelected$: sources.DOM.select(".cell").events("click")
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id])
    };
    return actions;
}

function model(actions) {
    
    function seedState() {
        return {
            cells: [
                EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE,
                EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE,
                EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE]
        };
    }
    
    const humanMove$ = actions.cellSelected$.map(cellIndex => {
        return function(state) {
            if (state.cells[cellIndex] !== EMPTY_VALUE) {
                return state;
            }
            const newCells = state.cells.slice();
            newCells[cellIndex] = CROSS_VALUE;
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

function view(state$) {
    const vtree$ = state$.map(state =>
        <table id="board">
            <tbody>
                <tr className="thickBottom">
                    <td id="cell00" className="cell thickRight">{cellContents(state, 0)}</td>
                    <td id="cell01" className="cell thickRight">{cellContents(state, 1)}</td>
                    <td id="cell02" className="cell">{cellContents(state, 2)}</td>
                </tr>
                <tr className="thickBottom">
                    <td id="cell10" className="cell thickRight">{cellContents(state, 3)}</td>
                    <td id="cell11" className="cell thickRight">{cellContents(state, 4)}</td>
                    <td id="cell12" className="cell">{cellContents(state, 5)}</td>
                </tr>
                <tr>
                    <td id="cell20" className="cell thickRight">{cellContents(state, 6)}</td>
                    <td id="cell21" className="cell thickRight">{cellContents(state, 7)}</td>
                    <td id="cell22" className="cell">{cellContents(state, 8)}</td>
                </tr>
            </tbody>
        </table>);
    return vtree$;
} 

export default function Board(sources) {
    return {
        DOM: view(model(intent(sources))) 
    };
}
