import {Observable, Subject, Scheduler} from "rx";
import {hJSX} from "@cycle/dom";
import R from "ramda";
import Board from "./Board";
import Messages from "./Messages";
import Buttons from "./Buttons";

const GAME_STATE_NOT_STARTED = 0;
const GAME_STATE_HUMAN_MOVE = 1;
const GAME_STATE_COMPUTER_MOVE = 2;
const GAME_STATE_GAME_OVER = 3;
const HUMAN_PLAYER = 1;
const COMPUTER_PLAYER = 2;
const NOUGHT = "O"; 
const CROSS = "X";
const EMPTY = " ";
const INITIAL_BOARD = EMPTY.repeat(9); 
const COMPUTER_MOVE_URL = "/api/computerMove";
const DELIBERATE_COMPUTER_MOVE_DELAY = 300;
    
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

function whoGoesFirst() {
    return Math.random() < 0.5 ? HUMAN_PLAYER : COMPUTER_PLAYER;
}

function init(_) {
    const state = {
        board: INITIAL_BOARD,
        humanPiece: CROSS,
        computerPiece: NOUGHT,
        gameState: GAME_STATE_NOT_STARTED,
        winningPlayer: null,
        winningLine: null
    };
    return state;
}

function startNewGame(actions, _) {
    const isHumanMove = whoGoesFirst() == HUMAN_PLAYER;
    const state = {
        board: INITIAL_BOARD,
        humanPiece: CROSS,
        computerPiece: NOUGHT,
        gameState: isHumanMove ? GAME_STATE_HUMAN_MOVE : GAME_STATE_COMPUTER_MOVE,
        winningPlayer: null,
        winningLine: null
    };
    if (!isHumanMove) {
        const request = makeComputerMoveRequest(state);
        actions.request$.onNext(request);
    }
    return state;
}

function humanMove(actions, index, state) {
    if (state.gameState !== GAME_STATE_HUMAN_MOVE) {
        return state;
    }
    if (state.board[index] !== EMPTY) {
        return state;
    }
    const updatedState = {
        board: setCharAt(state.board, state.humanPiece, index),
        humanPiece: state.humanPiece,
        computerPiece: state.computerPiece,
        gameState: GAME_STATE_COMPUTER_MOVE,
        winningPlayer: null,
        winningLine: null
    };
    const request = makeComputerMoveRequest(updatedState);
    actions.request$.onNext(request);
    return updatedState;
}

function computerMove(responseBody, state) {
    const updatedState = {
        board: responseBody.board,
        humanPiece: state.humanPiece,
        computerPiece: state.computerPiece,
        gameState: responseBody.gameOver ? GAME_STATE_GAME_OVER : GAME_STATE_HUMAN_MOVE,
        winningPlayer: responseBody.winningPlayer || null,
        winningLine: responseBody.winningLine || null
    };
    return updatedState;
}

const curriedStartNewGame = R.curry(startNewGame);
const curriedHumanMove = R.curry(humanMove);
const curriedComputerMove = R.curry(computerMove);

function model(actions) {
    const init$ = actions.init$.map(_ => init);
    const start$ = actions.start$.map(_ => curriedStartNewGame(actions));  
    const newGame$ = actions.newGame$.map(_ => curriedStartNewGame(actions));  
    const humanMove$ = actions.chosenCell$.map(index => curriedHumanMove(actions, index));
    const computerMove$ = actions.response$$
        .mergeAll()
        .delay(DELIBERATE_COMPUTER_MOVE_DELAY)
        .map(response => curriedComputerMove(response.body));
    const transform$ = Observable.merge(init$, start$, humanMove$, computerMove$, newGame$);
    const state$ = transform$.scan((state, transform) => transform(state), {});
    return state$;
}

function TicTacToe(sources, init$) {
    const proxyState$ = new Subject();
    const board = Board(sources, proxyState$);
    const messages = Messages(sources, proxyState$);
    const buttons = Buttons(sources, proxyState$);
    const actions = {
        init$: init$,
        chosenCell$: board.chosenCell$,
        start$: buttons.start$,
        newGame$: buttons.newGame$,
        request$: new Subject(),
        response$$: sources.HTTP
    };
    const state$ = model(actions);
    state$.subscribe(proxyState$);
    return {
        DOM: Observable.combineLatest(board.DOM, messages.DOM, buttons.DOM, (boardVTree, messagesVTree, buttonsVTree) =>
            <div>
                <h1 align="center">Tic-Tac-Go</h1>
                {boardVTree}
                {messagesVTree}
                {buttonsVTree}
            </div>),
        HTTP: actions.request$
    };
}

export default TicTacToe;
