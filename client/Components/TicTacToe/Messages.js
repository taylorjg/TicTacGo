import {hJSX} from "@cycle/dom";

const CHOOSE_PIECE_MESSAGE = "Click the Start button to begin.";
const PLAYER1_TURN_MESSAGE = "Your turn. Click an empty square to make your move.";
const PLAYER2_TURN_MESSAGE = "The computer is thinking...";
const PLAYER1_WON_MESSAGE = "You won!";
const PLAYER2_WON_MESSAGE = "The computer won!";
const DRAW_MESSAGE = "It's a draw!";
const UNKNOWN_WINNER_MESSAGE = "I am confused about who won!?";
const UNNOWN_GAME_STATE_MESSAGE = "I am confused about the state of the game!?";

function selectMessage(state) {
    
    switch (state.gameState) {
        case 0: // GAME_STATE_NOT_STARTED
            return CHOOSE_PIECE_MESSAGE;
        case 1: // GAME_STATE_HUMAN_MOVE
            return PLAYER1_TURN_MESSAGE;
        case 2: // GAME_STATE_COMPUTER_MOVE
            return PLAYER2_TURN_MESSAGE;
        case 3: // GAME_STATE_GAME_OVER
            switch (state.winningPlayer) {
                case 1: return PLAYER1_WON_MESSAGE;
                case 2: return PLAYER2_WON_MESSAGE;
                case 3: return DRAW_MESSAGE;
                default: return UNKNOWN_WINNER_MESSAGE;
            }
        default:
            return "";
    }
}

function renderMessageRow(state) {
    const message = selectMessage(state);
    const showSpinner = state.gameState === 2; // GAME_STATE_COMPUTER_MOVE 
    const spinner = showSpinner ? <img id="spinner" src="spinner.gif" alt="spinner" /> : null; 
    const vtree$ =
        <div className="alert alert-info">
            <span>{message}</span><span>{spinner}</span>
        </div>
    return vtree$;
}

function view(state$) {
    const vtree$ = state$.map(renderMessageRow);
    return vtree$;
}

function Messages(sources, state$) {
    return {
        DOM: view(state$)
    };
}

export default Messages;
