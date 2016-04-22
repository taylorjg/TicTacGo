import Rx from "rx";
import Cycle from "@cycle/core";
import {makeDOMDriver, h1, hJSX} from "@cycle/dom"; 

function main() {
    return {
        DOM: Rx.Observable.of(
    <div className="container">
        <div className="row">
            <div className="col-md-offset-4 col-md-4">
                <h1>Tic-Tac-Toe</h1>
                <table id="board">
                    <tbody>
                        <tr className="thickBottom">
                            <td id="cell00" className="thickRight"></td>
                            <td id="cell01" className="thickRight"></td>
                            <td id="cell02"></td>
                        </tr>
                        <tr className="thickBottom">
                            <td id="cell10" className="thickRight"></td>
                            <td id="cell11" className="thickRight"></td>
                            <td id="cell12"></td>
                        </tr>
                        <tr>
                            <td id="cell20" className="thickRight"></td>
                            <td id="cell21" className="thickRight"></td>
                            <td id="cell22"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="row" id="radioButtons">
            <div className="col-md-offset-3 col-md-6">
                <label for="noughtsRadio" className="radio-inline">
                    <input type="radio" name="player1Piece" id="noughtsRadio" value="noughts">O</input>
                </label>
                <label for="crossesRadio" className="radio-inline">
                    <input type="radio" name="player1Piece" id="crossesRadio" value="crosses">X</input>
                </label>
            </div>
        </div>
        <div className="row">
            <div className="col-md-offset-3 col-md-6">
                <div className="alert alert-info">
                    <span id="messageArea"></span>
                    <img id="spinner" src="spinner.gif" alt="spinner" />
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-offset-3 col-md-6">
                <button id="startBtn" className="btn btn-sm btn-primary" type="button">Start</button>
                <button id="resetBtn" className="btn btn-sm btn-danger" type="button">Reset</button>
            </div>
        </div>
    </div>
        )
    };
}

const drivers = {
    DOM: makeDOMDriver("#app")
};

Cycle.run(main, drivers);
