import {Observable} from "rx";

function isolateSource(source, scope) {
    return source;
}

function isolateSink(sink, scope) {
    return sink;
}

function setFocusDriver(selector$) {    
    
    selector$.delay(0).subscribe(selector => {
        const elem = document.querySelector(selector);
        console.log("elem", elem);
        if (elem) {
            elem.focus();
        }
    });
    
    const result = Observable.empty();
    result.isolateSource = isolateSource;
    result.isolateSink = isolateSink;
    
    return result;
}

export default setFocusDriver;
