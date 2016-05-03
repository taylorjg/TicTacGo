import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import {GAME_STATE_NOT_STARTED, GAME_STATE_GAME_OVER} from "./constants";

function intent(sources) {
    const s1$ = Observable.combineLatest(sources.init$, sources.props$, (_, props) => {
        return props.initialFocus ? ".start" : null;
    });
    const s2$ = Observable.combineLatest(sources.state$, sources.props$, (state, props) => {
        return state.gameState === GAME_STATE_GAME_OVER ? ".newGame" : null;
    });
    const actions = {
        start$: sources.DOM.select(".start").events("click"),
        newGame$: sources.DOM.select(".newGame").events("click"),
        setFocusSelector$: Observable.merge(s1$, s2$).filter(selector => selector !== null)
    };
    return actions;
}

function renderButtonRow(state, props) {
    const startButton = state.gameState === GAME_STATE_NOT_STARTED
        ? <button type="button" className="start btn btn-sm btn-primary" tabIndex={props.firstTabIndex + 10}>Start</button>
        : null;
    const newGameButton = state.gameState === GAME_STATE_GAME_OVER
        ? <button type="button" className="newGame btn btn-sm btn-primary" tabIndex={props.firstTabIndex + 11}>New Game</button>
        : null;
    const vtree$ = <div>{startButton}{newGameButton}</div>;
    return vtree$;
}

function view(sources) {
    return Observable.combineLatest(sources.state$, sources.props$, renderButtonRow);
}

function Buttons(sources) {
    const actions = intent(sources);
    return {
        DOM: view(sources),
        start$: actions.start$,
        newGame$: actions.newGame$,
        setFocusSelector$: actions.setFocusSelector$
    };
}

export default Buttons;
