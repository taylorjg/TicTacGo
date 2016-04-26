import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";

function renderButtonRow(state) {
    const newGameButton = state.isGameOver
        ? <button type="button" className="newGame btn btn-sm btn-primary">New Game</button>
        : null;
    const vtree$ =
        <div className="row">
            <div className="col-md-offset-4 col-md-4">
                {newGameButton}
            </div>
        </div>;
    return vtree$;
}

function view(state$) {
    const vtree$ = state$.map(state => {renderButtonRow(state)});
    return vtree$;
}

function Buttons(state$) {
    return {
        DOM: view(state$)
    };
}

export default Buttons;
