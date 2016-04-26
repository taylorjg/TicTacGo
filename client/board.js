import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";

const IDS_TO_CELL_INDICES = {
    "cell00": 0,
    "cell01": 1,
    "cell02": 2,
    "cell10": 3,
    "cell11": 4,
    "cell12": 5,
    "cell20": 6,
    "cell21": 7,
    "cell22": 8
};

// function intent(sources) {
//     const actions = {
//         cellSelected$: sources.DOM.select(".cell").events("click")
//             .map(ev => ev.target.id)
//             .map(id => IDS_TO_CELL_INDICES[id]),
//         newGame$: sources.DOM.select(".newGame").events("click"),
//         request$: new Subject(),
//         response$$: sources.HTTP
//     };
//     return actions;
// }

// function model(actions) {
    
//     function seedState() {
//         return {
//             board: INITIAL_BOARD,
//             humanPiece: CROSS,
//             computerPiece: NOUGHT,
//             isHumanMove: true,
//             isGameOver: false,
//             winningPlayer: null,
//             winningLine: null
//         };
//     }
    
//     const humanMove$ = actions.cellSelected$.map(index =>
//         state => {
//             if (state.isGameOver || !state.isHumanMove || state.board[index] !== EMPTY) {
//                 return state;
//             }
//             const updatedState = {
//                 board: setCharAt(state.board, state.humanPiece, index),
//                 humanPiece: state.humanPiece,
//                 computerPiece: state.computerPiece,
//                 isHumanMove: false,
//                 isGameOver: false,
//                 winningPlayer: null,
//                 winningLine: null
//             };
//             const request = makeComputerMoveRequest(updatedState);
//             actions.request$.onNext(request);
//             return updatedState;
//         });
        
//     const computerMove$ = actions.response$$
//         .filter(response$ => response$.request.category === "computerMove")
//         .mergeAll()
//         .map(response =>
//             state => {
//                 const updatedState = {
//                     board: response.body.board,
//                     humanPiece: state.humanPiece,
//                     computerPiece: state.computerPiece,
//                     isHumanMove: true,
//                     isGameOver: response.body.gameOver,
//                     winningPlayer: response.body.winningPlayer || null,
//                     winningLine: response.body.winningLine || null
//                 };
//                 return updatedState;
//             });

//     const newGame$ = actions.newGame$.map(_ => _ => seedState());  
    
//     const transform$ = Observable.merge(
//         humanMove$,
//         computerMove$,
//         newGame$);
    
//     const state$ = transform$
//         .startWith(seedState())
//         .scan((state, transform) => transform(state));
        
//     return state$;
// }

function intent(sources) {
    const actions = {
        chosenCell$: sources.DOM.select(".cell").events("click")
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id]),
    };
    return actions;
}

function renderCell(state, id) {
    const index = IDS_TO_CELL_INDICES[id];
    var classNames = ["cell"];
    const needsThickRightBorder = index % 3 !== 2; 
    if (needsThickRightBorder) {
        classNames.push("thickRight");
    }
    const needsHightlight = state.winningLine && state.winningLine.includes(index);
    if (needsHightlight) {
        classNames.push("highlight");
    }
    const vtree$ = <td id={id} className={classNames.join(" ")}>{state.board[index]}</td>;
    return vtree$;
}

// function renderButtonRow(state) {
//     const newGameButton = state.isGameOver
//         ? <button type="button" className="newGame btn btn-sm btn-primary">New Game</button>
//         : null;
//     const vtree$ =
//         <div className="row">
//             <div className="col-md-offset-4 col-md-4">
//                 {newGameButton}
//             </div>
//         </div>;
//     return vtree$;
// }

function view(state$) {
    const vtree$ = state$.map(state =>
        <div className="row">
            <div className="col-md-offset-4 col-md-4">
                <table id="board">
                    <tbody>
                        <tr className="thickBottom">
                            {renderCell(state, "cell00")}
                            {renderCell(state, "cell01")}
                            {renderCell(state, "cell02")}
                        </tr>
                        <tr className="thickBottom">
                            {renderCell(state, "cell10")}
                            {renderCell(state, "cell11")}
                            {renderCell(state, "cell12")}
                        </tr>
                        <tr>
                            {renderCell(state, "cell20")}
                            {renderCell(state, "cell21")}
                            {renderCell(state, "cell22")}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>);
    return vtree$;
} 

function Board(sources, state$) {
    const actions = intent(sources);
    return {
        DOM: view(state$),
        chosenCell$: actions.chosenCell$
    };
}

export default Board;
