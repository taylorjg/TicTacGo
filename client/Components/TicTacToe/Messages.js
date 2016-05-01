import {hJSX} from "@cycle/dom";
import {
    GAME_STATE_NOT_STARTED,
    GAME_STATE_HUMAN_MOVE,
    GAME_STATE_COMPUTER_MOVE,
    GAME_STATE_GAME_OVER,
    HUMAN_PLAYER,
    COMPUTER_PLAYER,
    DRAW
} from "./constants";

const START_MESSAGE = "Use the Start button to begin.";
const HUMAN_MOVE_MESSAGE = "Your turn. Select an empty square to make your move.";
const COMPUTER_MOVE_MESSAGE = "The computer is thinking...";
const HUMAN_WON_MESSAGE = "You won!";
const COMPUTER_WON_MESSAGE = "The computer won!";
const DRAW_MESSAGE = "It's a draw!";
const UNKNOWN_WINNER_MESSAGE = "I am confused about who won!?";
const UNKNOWN_GAME_STATE_MESSAGE = "I am confused about the state of the game!?";

function getMessage(state) {
    
    switch (state.gameState) {
        
        case GAME_STATE_NOT_STARTED:
            return START_MESSAGE;
            
        case GAME_STATE_HUMAN_MOVE:
            return HUMAN_MOVE_MESSAGE;
            
        case GAME_STATE_COMPUTER_MOVE:
            return COMPUTER_MOVE_MESSAGE;
            
        case GAME_STATE_GAME_OVER:
            switch (state.winningPlayer) {
                case HUMAN_PLAYER: return HUMAN_WON_MESSAGE;
                case COMPUTER_PLAYER: return COMPUTER_WON_MESSAGE;
                case DRAW: return DRAW_MESSAGE;
                default: return UNKNOWN_WINNER_MESSAGE;
            }
            
        default:
            return UNKNOWN_GAME_STATE_MESSAGE;
    }
}

function renderMessageRow(state) {
    const message = getMessage(state);
    const showSpinner = state.gameState === GAME_STATE_COMPUTER_MOVE; 
    const spinner = showSpinner ? <img id="spinner" src="spinner.gif" alt="spinner" /> : null; 
    const vtree$ =
        <div className="alert alert-info">
            <span>{message}</span>
            <span>{spinner}</span>
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
