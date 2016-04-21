(function() {
    
    function main() {
        return {
            DOM: Rx.Observable.interval(1000)
                .map(i => CycleDOM.h1(`${i} seconds elapsed`))
        };
    }
    
    const drivers = {
        DOM: CycleDOM.makeDOMDriver("#app")
    };
    
    Cycle.run(main, drivers);
}());
