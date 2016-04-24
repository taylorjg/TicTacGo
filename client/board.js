import Rx from "rx";
import {hJSX} from "@cycle/dom";

const NOUGHT = "O"; 
const CROSS = "X";
const EMPTY = "-";
const INITIAL_BOARD = EMPTY.repeat(9); 

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

const COMPUTER_MOVE_URL = "/api/computerMove"; 

function cellDisplayValue(state, index) {
    var piece = state.board[index];
    switch (piece) {
        case NOUGHT:
        case CROSS:
            return piece; 
        default:
            return "";
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
            board: INITIAL_BOARD,
            player1Piece: CROSS,
            player2Piece: NOUGHT
        };
    }
    
    const humanMove$ = actions.cellSelected$.map(index => {
        return function(state) {
            if (state.board[index] !== EMPTY) {
                return state;
            }
            const chars = state.board.split("");
            chars[index] = state.player1Piece;
            const updatedBoard = chars.join("");
            const updatedState = {
                board: updatedBoard,
                player1Piece: state.player1Piece,
                player2Piece: state.player2Piece
            };
            return updatedState;
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
                    <td id="cell00" className="cell thickRight">{cellDisplayValue(state, 0)}</td>
                    <td id="cell01" className="cell thickRight">{cellDisplayValue(state, 1)}</td>
                    <td id="cell02" className="cell">{cellDisplayValue(state, 2)}</td>
                </tr>
                <tr className="thickBottom">
                    <td id="cell10" className="cell thickRight">{cellDisplayValue(state, 3)}</td>
                    <td id="cell11" className="cell thickRight">{cellDisplayValue(state, 4)}</td>
                    <td id="cell12" className="cell">{cellDisplayValue(state, 5)}</td>
                </tr>
                <tr>
                    <td id="cell20" className="cell thickRight">{cellDisplayValue(state, 6)}</td>
                    <td id="cell21" className="cell thickRight">{cellDisplayValue(state, 7)}</td>
                    <td id="cell22" className="cell">{cellDisplayValue(state, 8)}</td>
                </tr>
            </tbody>
        </table>);
    return vtree$;
} 

function makeComputerMoveRequest(state) {
    return {
        url: COMPUTER_MOVE_URL,
        method: "POST",
        query: {
            board: state.board,
            player1Piece: CROSS,
            player2Piece: NOUGHT
        }
    };
}

export default function Board(sources) {
    const state$ = model(intent(sources));
    return {
        DOM: view(state$),
        HTTP: null
    };
}
