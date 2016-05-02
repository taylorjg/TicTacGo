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
    
    selector$.delay(0).subscribe(item => {
        let root = document;
        let selector = item;
        if (item.scope) {
            const rootSelector = `.cycle-scope-${item.scope}`;
            root = document.querySelector(rootSelector);
            selector = item.selector;
        }
        const elem = root.querySelector(selector);
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
