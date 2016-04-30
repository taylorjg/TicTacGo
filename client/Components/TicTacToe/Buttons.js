import {hJSX} from "@cycle/dom";
import {GAME_STATE_NOT_STARTED, GAME_STATE_GAME_OVER} from "./constants";

function intent(sources) {
    const actions = {
        start$: sources.DOM.select(".start").events("click"),
        newGame$: sources.DOM.select(".newGame").events("click")
    };
    return actions;
}

function renderButtonRow(state) {
    const startButton = state.gameState === GAME_STATE_NOT_STARTED
        ? <button type="button" className="start btn btn-sm btn-primary">Start</button>
        : null;
    const newGameButton = state.gameState === GAME_STATE_GAME_OVER
        ? <button type="button" className="newGame btn btn-sm btn-primary">New Game</button>
        : null;
    const vtree$ = <div>{startButton}{newGameButton}</div>;
    return vtree$;
}

function view(state$) {
    const vtree$ = state$.map(renderButtonRow);
    return vtree$;
}

function Buttons(sources, state$) {
    const actions = intent(sources);
    return {
        DOM: view(state$),
        start$: actions.start$,
        newGame$: actions.newGame$
    };
}

export default Buttons;
