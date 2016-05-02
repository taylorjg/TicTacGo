import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import R from "ramda";
import Board from "./Board";
import Messages from "./Messages";
import Buttons from "./Buttons";
import {
    GAME_STATE_NOT_STARTED,
    GAME_STATE_HUMAN_MOVE,
    GAME_STATE_COMPUTER_MOVE,
    GAME_STATE_GAME_OVER,
    HUMAN_PLAYER,
    COMPUTER_PLAYER
} from "./constants";

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
    if (state.gameState === GAME_STATE_COMPUTER_MOVE) {
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
    const humanMove$ = actions.selectedCell$.map(index => curriedHumanMove(actions, index));
    const computerMove$ = actions.response$$
        .mergeAll()
        .delay(DELIBERATE_COMPUTER_MOVE_DELAY)
        .map(response => curriedComputerMove(response.body));
    const transform$ = Observable.merge(init$, start$, humanMove$, computerMove$, newGame$);
    const state$ = transform$.scan((state, transform) => transform(state), {});
    return state$;
}

function TicTacToe(sources, init$, props$) {
    const proxyState$ = new Subject();
    sources.props$ = props$;
    sources.state$ = proxyState$;
    const board = Board(sources);
    const messages = Messages(sources);
    const buttons = Buttons(sources);
    const actions = {
        init$: init$,
        selectedCell$: board.selectedCell$,
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
        HTTP: actions.request$,
        SetFocus: board.setFocusSelector$
    };
}

export default TicTacToe;
