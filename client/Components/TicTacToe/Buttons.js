import {hJSX} from "@cycle/dom";

function intent(sources) {
    const actions = {
        newGame$: sources.DOM.select(".newGame").events("click")
    };
    return actions;
}

function renderButtonRow(state) {
    const newGameButton = state.isGameOver
        ? <button type="button" className="newGame btn btn-sm btn-primary">New Game</button>
        : null;
    const vtree$ = newGameButton;
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
        newGame$: actions.newGame$
    };
}

export default Buttons;
