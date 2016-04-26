import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
// import Board from "./board";
import Buttons from "./buttons";

function model(actions) {
    // chosenCell$
    // newGame$
    // HTTP (response$$)
    // => state$
    const state$ = Observable.just({
        isGameOver: true
    }).delay(1000); // TIMING ISSUE !!!
    return state$;
}

function TicTacToe(sources) {
    const proxyState$ = new Subject();
    // const board = Board(sources, proxyState$);
    const buttons = Buttons(sources, proxyState$);
    const actions = {
        // chosenCell$: board.chosenCell$,
        newGame$: buttons.newGame$,
        request$: new Subject(),
        response$$: sources.HTTP
    };
    
    const state$ = model(actions);
    state$.subscribe(proxyState$);
    
    return {
        // DOM: Observable.combineLatest(buttons.DOM, (buttonsVTree) =>
        //     <div>
        //         {buttonsVTree}
        //     </div>),
        DOM: buttons.DOM,
        HTTP: actions.request$
    };
}

export default TicTacToe;
