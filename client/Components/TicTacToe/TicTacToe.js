import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import Board from "./Board";
import Buttons from "./Buttons";

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
            isGameOver: false,
            winningPlayer: null,
            winningLine: null
        };
    }

    const humanMove$ = actions.chosenCell$.map(index =>
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

    const newGame$ = actions.newGame$.map(_ => _ => seedState());  
    
    const transform$ = Observable.merge(humanMove$, computerMove$, newGame$);
    
    const state$ = transform$
        .startWith(seedState())
        .scan((state, transform) => transform(state))
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
