import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";

const NOUGHT = "O"; 
const CROSS = "X";
const EMPTY = " ";
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

function setCharAt(s, ch, index) {
    const chs = s.split("");
    chs[index] = ch;
    return chs.join("");
} 

function makeComputerMoveRequest(state) {
    return {
        url: COMPUTER_MOVE_URL,
        method: "POST",
        send: {
            board: state.board,
            player1Piece: state.humanPiece,
            player2Piece: state.computerPiece
        },
        category: "computerMove"
    };
}

function intent(sources) {
    const actions = {
        cellSelected$: sources.DOM.select(".cell").events("click")
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id]),
        request$: new Subject(),
        response$$: sources.HTTP
    };
    return actions;
}

function model(actions) {
    
    function seedState() {
        return {
            board: INITIAL_BOARD,
            humanPiece: CROSS,
            computerPiece: NOUGHT,
            isHumanMove: true,
            isGameOver: false,
            winningPlayer: null,
            winningLine: null
        };
    }
    
    const humanMove$ = actions.cellSelected$.map(index =>
        state => {
            if (state.isGameOver || !state.isHumanMove || state.board[index] !== EMPTY) {
                return state;
            }
            const updatedState = {
                board: setCharAt(state.board, state.humanPiece, index),
                humanPiece: state.humanPiece,
                computerPiece: state.computerPiece,
                isHumanMove: false,
                isGameOver: false,
                winningPlayer: null,
                winningLine: null
            };
            const request = makeComputerMoveRequest(updatedState);
            actions.request$.onNext(request);
            return updatedState;
        });
        
    const computerMove$ = actions.response$$
        .filter(response$ => response$.request.category === "computerMove")
        .mergeAll()
        .map(response =>
            state => {
                const updatedState = {
                    board: response.body.board,
                    humanPiece: state.humanPiece,
                    computerPiece: state.computerPiece,
                    isHumanMove: true,
                    isGameOver: response.body.gameOver,
                    winningPlayer: response.body.winningPlayer || null,
                    winningLine: response.body.winningLine || null
                };
                return updatedState;
            });

    const transform$ = Observable.merge(humanMove$, computerMove$); 
    
    const state$ = transform$
        .startWith(seedState())
        .scan((state, transform) => transform(state));
        
    return state$;
}

function renderButtonRow(state) {
    const vtree$ =
        <div className="row">
            <div className="col-md-offset-4 col-md-4">
                {
                    state.isGameOver
                        ? <button type="button" className=".newGame btn btn-sm btn-primary">New Game</button>
                        : null
                }
            </div>
        </div>;
    return vtree$;
}

function view(state$) {
    const vtree$ = state$.map(state =>
        <div>
            <div className="row">
                <div className="col-md-offset-4 col-md-4">
                    <table id="board">
                        <tbody>
                            <tr className="thickBottom">
                                <td id="cell00" className="cell thickRight">{state.board[0]}</td>
                                <td id="cell01" className="cell thickRight">{state.board[1]}</td>
                                <td id="cell02" className="cell">{state.board[2]}</td>
                            </tr>
                            <tr className="thickBottom">
                                <td id="cell10" className="cell thickRight">{state.board[3]}</td>
                                <td id="cell11" className="cell thickRight">{state.board[4]}</td>
                                <td id="cell12" className="cell">{state.board[5]}</td>
                            </tr>
                            <tr>
                                <td id="cell20" className="cell thickRight">{state.board[6]}</td>
                                <td id="cell21" className="cell thickRight">{state.board[7]}</td>
                                <td id="cell22" className="cell">{state.board[8]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {renderButtonRow(state)}
        </div>);
    return vtree$;
} 

function Board(sources) {
    const actions = intent(sources);
    const state$ = model(actions);
    return {
        DOM: view(state$),
        HTTP: actions.request$
    };
}

export default Board;
