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

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

function intent(sources) {
    const click$ = sources.DOM.select(".cell").events("click");
    const spaceKey$ = sources.DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === 32);
    const actions = {
        selectedCell$: Observable.merge(click$, spaceKey$)
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id]),
        leftKey$: sources.DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === LEFT_ARROW)
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id]),
        upKey$: sources.DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === UP_ARROW)
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id]),
        rightKey$: sources.DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === RIGHT_ARROW)
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id]),
        downKey$: sources.DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === DOWN_ARROW)
            .map(ev => ev.target.id)
            .map(id => IDS_TO_CELL_INDICES[id])
    };
    return actions;
}

function model(actions) {
    const l$ = actions.leftKey$.map(index => index % 3 !== 0 ? index - 1 : -1); 
    const u$ = actions.upKey$.map(index => index > 2 ? index - 3 : -1); 
    const r$ = actions.rightKey$.map(index => index % 3 !== 2 ? index + 1 : -1); 
    const d$ = actions.downKey$.map(index => index < 6 ? index + 3 : -1);
    return Observable.merge(l$, u$, r$, d$).startWith(-1);
}

function renderCell(state, id, cellToFocus) {
    const index = IDS_TO_CELL_INDICES[id];
    var classNamesTd = [];
    var classNamesDiv = ["cell"];
    const needsThickRightBorder = index % 3 !== 2; 
    if (needsThickRightBorder) {
        classNamesTd.push("thickRight");
    }
    const needsHightlight = state.winningLine && state.winningLine.includes(index);
    if (needsHightlight) {
        classNamesDiv.push("highlight");
    }
    const focusThisCell = index === cellToFocus;
    const vtree$ =
        <td className={classNamesTd.join(" ")}>
            <div id={id} className={classNamesDiv.join(" ")} tabIndex>
                {state.board[index]}
            </div>
        </td>;
    // TODO: create a new driver to set focus to a control that
    //       will be equivalent to doing the following:
    // if (focusThisCell) {
    //     document.getElementById(id).focus();
    // }
    return vtree$;
}

function view(state$, cellToFocus$) {
    const vtree$ = Observable.combineLatest(state$, cellToFocus$, (state, cellToFocus) =>
        <table id="board">
            <tbody>
                <tr className="thickBottom">
                    {renderCell(state, "cell00", cellToFocus)}
                    {renderCell(state, "cell01", cellToFocus)}
                    {renderCell(state, "cell02", cellToFocus)}
                </tr>
                <tr className="thickBottom">
                    {renderCell(state, "cell10", cellToFocus)}
                    {renderCell(state, "cell11", cellToFocus)}
                    {renderCell(state, "cell12", cellToFocus)}
                </tr>
                <tr>
                    {renderCell(state, "cell20", cellToFocus)}
                    {renderCell(state, "cell21", cellToFocus)}
                    {renderCell(state, "cell22", cellToFocus)}
                </tr>
            </tbody>
        </table>);
    return vtree$;
} 

function Board(sources, state$) {
    const actions = intent(sources);
    const cellToFocus$ = model(actions);
    return {
        DOM: view(state$, cellToFocus$),
        selectedCell$: actions.selectedCell$
    };
}

export default Board;
