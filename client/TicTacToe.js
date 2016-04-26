import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import Board from "./board";
import Buttons from "./buttons";

const NOUGHT = "O"; 
const CROSS = "X";
const EMPTY = " ";
const INITIAL_BOARD = EMPTY.repeat(9); 
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

function model(actions) {
    
    function seedState() {
        return {
            board: INITIAL_BOARD,
            humanPiece: CROSS,
            computerPiece: NOUGHT,
            isHumanMove: true,
            // isGameOver: false,
            isGameOver: true,
            winningPlayer: null,
            winningLine: null
        };
    }

    const newGame$ = actions.newGame$.map(_ => _ => seedState());  
    
    const transform$ = Observable.merge(newGame$);
    
    const state$ = transform$
        .startWith(seedState())
        .scan((state, transform) => {
            console.log("state", state);
            const newState = transform(state);
            console.log("newState", newState);
            return newState;
        })
        .delay(50); // INITIALISATION TIMING ISSUE !!!
        
    return state$;
}

function TicTacToe(sources) {
    const proxyState$ = new Subject();
    const board = Board(sources, proxyState$);
    const buttons = Buttons(sources, proxyState$);
    const actions = {
        chosenCell$: board.chosenCell$,
        newGame$: buttons.newGame$,
        request$: new Subject(),
        response$$: sources.HTTP
    };
    
    const state$ = model(actions);
    state$.subscribe(proxyState$);
    
    return {
        DOM: Observable.combineLatest(board.DOM, buttons.DOM, (boardVTree, buttonsVTree) =>
            <div>
                {boardVTree}
                {buttonsVTree}
            </div>),
        HTTP: actions.request$
    };
}

export default TicTacToe;
