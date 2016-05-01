import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import R from "ramda";

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

const SPACE_KEY = 32;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;

function filteredKeydown(DOM, keyCode) {
    return DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === keyCode);
}

function eventToCellIndex(event$) {
    return event$.map(ev => IDS_TO_CELL_INDICES[ev.target.id]);
}

function intent(sources) {
    const click$ = sources.DOM.select(".cell").events("click");
    const spaceKey$ = filteredKeydown(sources.DOM, SPACE_KEY);
    const actions = {
        selectedCell$: eventToCellIndex(Observable.merge(click$, spaceKey$)),
        leftKey$: eventToCellIndex(filteredKeydown(sources.DOM, LEFT_ARROW_KEY)),
        upKey$: eventToCellIndex(filteredKeydown(sources.DOM, UP_ARROW_KEY)),
        rightKey$: eventToCellIndex(filteredKeydown(sources.DOM, RIGHT_ARROW_KEY)),
        downKey$: eventToCellIndex(filteredKeydown(sources.DOM, DOWN_ARROW_KEY))
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

function renderCell(state, props, cellToFocus, id) {
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
    const vtree$ =
        <td className={classNamesTd.join(" ")}>
            <div id={id} className={classNamesDiv.join(" ")} tabIndex={props.firstTabIndex + index}>
                {state.board[index]}
            </div>
        </td>;
        
    const focusThisCell = index === cellToFocus;
    // TODO: create a new driver to set focus to a control that will be equivalent to doing the following:
    if (focusThisCell) {
        document.getElementById(id).focus();
    }
    
    return vtree$;
}

const curriedRenderCell = R.curry(renderCell);

function renderBoard(state, props, cellToFocus) {
    const partiallyAppliedRenderCell = curriedRenderCell(state, props, cellToFocus);
    const vtree$ =
        <table id="board">
            <tbody>
                <tr className="thickBottom">
                    {partiallyAppliedRenderCell("cell00")}
                    {partiallyAppliedRenderCell("cell01")}
                    {partiallyAppliedRenderCell("cell02")}
                </tr>
                <tr className="thickBottom">
                    {partiallyAppliedRenderCell("cell10")}
                    {partiallyAppliedRenderCell("cell11")}
                    {partiallyAppliedRenderCell("cell12")}
                </tr>
                <tr>
                    {partiallyAppliedRenderCell("cell20")}
                    {partiallyAppliedRenderCell("cell21")}
                    {partiallyAppliedRenderCell("cell22")}
                </tr>
            </tbody>
        </table>;
    return vtree$;
}

function view(state$, props$, cellToFocus$) {
    return Observable.combineLatest(state$, props$, cellToFocus$, renderBoard);
} 

function Board(sources) {
    const actions = intent(sources);
    const cellToFocus$ = model(actions);
    return {
        DOM: view(sources.state$, sources.props$, cellToFocus$),
        selectedCell$: actions.selectedCell$
    };
}

export default Board;
