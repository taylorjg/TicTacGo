import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import {GAME_STATE_NOT_STARTED, GAME_STATE_GAME_OVER} from "./constants";

function intent(sources) {
    const s1$ = Observable.combineLatest(sources.init$, sources.props$, (_, props) => props.initialFocus ? ".start" : null);
    const s2$ = sources.gameOver$.map(_ => ".start");
    const actions = {
        start$: sources.DOM.select(".start").events("click"),
        setFocusSelector$: Observable.merge(s1$, s2$).filter(selector => selector !== null)
    };
    return actions;
}

function renderButtonRow(state, props) {
    const showStartButton =
        state.gameState === GAME_STATE_NOT_STARTED ||
        state.gameState === GAME_STATE_GAME_OVER; 
    const startButton = showStartButton
        ? <button type="button" className="start btn btn-sm btn-primary" tabIndex={props.firstTabIndex + 10}>Start</button>
        : null;
    const vtree$ = <div>{startButton}</div>;
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
        setFocusSelector$: actions.setFocusSelector$
    };
}

export default Buttons;
