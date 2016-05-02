import {Observable, Subject} from "rx";
import {hJSX} from "@cycle/dom";
import R from "ramda";

const IDS_TO_INDICES = {
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

const INDICES_TO_IDS = {
    0: "cell00",
    1: "cell01",
    2: "cell02",
    3: "cell10",
    4: "cell11",
    5: "cell12",
    6: "cell20",
    7: "cell21",
    8: "cell22"
};

const SPACE_KEY = 32;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;

const goLeft = index => index % 3 !== 0 ? index - 1 : -1;
const goUp = index => index > 2 ? index - 3 : -1;
const goRight = index => index % 3 !== 2 ? index + 1 : -1;
const goDown = index => index < 6 ? index + 3 : -1;

function filteredKeydown(DOM, keyCode) {
    return DOM.select(".cell").events("keydown").filter(ev => ev.keyCode === keyCode);
}

function eventToCellIndex(event$) {
    return event$.map(ev => IDS_TO_INDICES[ev.target.id]);
}

function navigateOnKeydown(sources, keyCode, direction) {
    return eventToCellIndex(filteredKeydown(sources.DOM, keyCode)).map(direction);
}

function intent(sources) {
    const click$ = sources.DOM.select(".cell").events("click");
    const spaceKey$ = filteredKeydown(sources.DOM, SPACE_KEY);
    const navigateLeft$ = navigateOnKeydown(sources, LEFT_ARROW_KEY, goLeft);
    const navigateUp$ = navigateOnKeydown(sources, UP_ARROW_KEY, goUp);
    const navigateRight$ = navigateOnKeydown(sources, RIGHT_ARROW_KEY, goRight);
    const navigateDown$ = navigateOnKeydown(sources, DOWN_ARROW_KEY, goDown);
    const actions = {
        selectedCell$: eventToCellIndex(Observable.merge(click$, spaceKey$)),
        setFocusSelector$: Observable.merge(navigateLeft$, navigateUp$, navigateRight$, navigateDown$)
            .filter(index => index >= 0)
            .map(index => INDICES_TO_IDS[index])
            .map(id => `#${id}`) 
    };
    return actions;
}

function renderCell(state, props, id) {
    const index = IDS_TO_INDICES[id];
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
    return vtree$;
}

const curriedRenderCell = R.curry(renderCell);

function renderBoard(state, props) {
    const partiallyAppliedRenderCell = curriedRenderCell(state, props);
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

function view(state$, props$) {
    return Observable.combineLatest(state$, props$, renderBoard);
} 

function Board(sources) {
    const actions = intent(sources);
    return {
        DOM: view(sources.state$, sources.props$),
        selectedCell$: actions.selectedCell$,
        setFocusSelector$: actions.setFocusSelector$
    };
}

export default Board;
