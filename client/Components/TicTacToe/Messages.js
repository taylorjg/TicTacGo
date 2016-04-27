import {hJSX} from "@cycle/dom";

const PLAYER1_TURN_MESSAGE = "Your turn. Click an empty square to make your move.";
const PLAYER2_TURN_MESSAGE = "The computer is thinking...";
const PLAYER1_WON_MESSAGE = "You won!";
const PLAYER2_WON_MESSAGE = "The computer won!";
const DRAW_MESSAGE = "It's a draw!";
const UNKNOWN_WINNER_MESSAGE = "I r confuse about who won!?";

function selectMessage(state) {
    
    if (state.isGameOver) {
        switch (state.winningPlayer) {
            case 1: return PLAYER1_WON_MESSAGE;
            case 2: return PLAYER2_WON_MESSAGE;
            case 3: return DRAW_MESSAGE;
            default: return UNKNOWN_WINNER_MESSAGE;
        }
    }
    
    return state.isHumanMove ? PLAYER1_TURN_MESSAGE : PLAYER2_TURN_MESSAGE;
}

function renderMessageRow(state) {
    const message = selectMessage(state);
    const showSpinner = !state.isGameOver && !state.isHumanMove;
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
