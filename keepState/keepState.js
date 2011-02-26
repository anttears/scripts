/*
I had a need to determine state depending on values from 2 different sources - 1 internal and one passed from a server (external).
The code below produces an array of state objects containing a function which determines wether to pass on to the next state
and a function to call when passing onto the next state.

In the example below, both the internal and external values must be the same to trigger a state change and state can only advance 
incrementally to state 5 which is the last state.

There is a function to override a particular state objects inherited function but if you are overriding a lot, it may be better
just to remove the inheritance.

*/

(function () {
    var state = 1, // This is the actual state and starts at 1
        internalState, // competing state 1
        externalState, // competing state 2
        previousState, // Previous state means that if 1 state is a pause, resume can be to previous state
        stateArray = []; // a list of the available states
    
    var StateObject = function (stateNumber) {
        var s = stateNumber;
        
        this.rules = function () {
            if ((internalState === externalState) && (internalState === s + 1)) {
                this.changeState(internalState);
            } else if (internalState === 5) {
                this.changeState(5);
            }
        };

        this.changeState = function (newState) {
            this.hasRun = true; // we know we have been at this state previously
            previousState = state;
            state = newState;
            document.getElementById("state").innerHTML = state;
        };

        this.hasRun = false;
    };

    var overRideObject = {
        "or5" : {
            "name": "rules",
            "func": function () { alert("state cannot be changed at the end"); }
        }
    }

    function testState () {
        stateArray[state].rules();    
    }

    function setState () {
        internalState = Number(document.getElementById("internalState").value);
        externalState = Number(document.getElementById("externalState").value);
        if (isNaN(internalState) || isNaN(externalState)) {
            throw new Error("State must be a number");
        }
        testState();
    }

    function overRide (so, or) {
        var newMethod = overRideObject[or];

        so[newMethod.name] = newMethod.func;
        return so;
    }

    function makeStateArray (i) {
        var so = new StateObject(i);
        var or = "or" + i;
        if (overRideObject[or]) {
            so = overRide(so, or);
        }
        return so;
    }

    function init () {
        document.getElementById("changeState").addEventListener("click", setState, true);

        for (var i = 1; i < 6; i += 1) {
            stateArray[i] = makeStateArray(i); //bare in mind i does not start at zero here, so don't enumerate the array.
        }
    }

    init();
})();
