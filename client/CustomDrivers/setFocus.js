import {Observable} from "rx";

function isolateSource(source, scope) {
    return source;
}

function isolateSink(sink, scope) {
    return sink;
}

function setFocusDriver(selector$) {    
    
    selector$.subscribe(selector => {
        const elem = document.querySelector(selector);
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
