import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import Board from "./board";
import Buttons from "./buttons";

function model(actions) {
    // chosenCell$
    // newGame$
    // HTTP (response$$)
    // => state$
}

function TicTacToe(sources) {
    const proxyState$ = new Subject();
    const board = Board(sources, proxyState$);
    const buttons = Buttons(sources, proxyState$);
    const actions = {
        chosenCell$: board.chosenCell$,
        newGame$: buttons.newGame$,
        request$: new Subject(),
        response$$: sources.HTTP
    };
    const state$ = model(actions);
    state$.do(proxyState.onNext); // is there a combinator that does this ?
    return {
        DOM: Observable.combineLatest(board.DOM, buttons.DOM, (boardVTree, buttonsVTree) =>
            <div>
                {boardVTree}
                {buttonsVTree}
            </div>),
        HTTP: actions.request$
    };
}

export default TicTacToe;
