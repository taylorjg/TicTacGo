import {Observable} from "rx";

function isolateSource(source, scope) {
    return source;
}

function isolateSink(sink, scope) {
    return sink.map(selector => {
        return {
            selector: selector,
            scope: scope
        };
    });
}

function setFocusDriver(selector$) {    
    
    selector$.delay(0).subscribe(selector => {
        if (selector.scope) {
            const rootSelector = `.cycle-scope-${selector.scope}`;
            const root = document.querySelector(rootSelector);
            if (root) {
                const elem = root.querySelector(selector.selector);
                if (elem) {
                    elem.focus();
                }
            }
        }
        else {
            const elem = document.querySelector(selector);
            if (elem) {
                elem.focus();
            }
        }
    });
    
    const result = Observable.empty();
    result.isolateSource = isolateSource;
    result.isolateSink = isolateSink;
    
    return result;
}

export default setFocusDriver;
