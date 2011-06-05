var bob = ["One", "Two", ["dd", "ee"], {x: "22", y: ["s", "a"]}];


/*
var bob;
function test(a, b, c) {
    bob = arguments;
}
test("d", "e", "f");
*/

//var bob = document.getElementsByTagName("li");


/*
var bob = {};
bob.first = 1;
bob.second = 2;
bob.third = 3;
*/


/*
var bob = [];
bob["a"] = "b";
bob["c"] = "d";
bob["e"] = "f";
*/


(function () {
    var fe = function (fn) {
        if (typeof fn !== "function") { throw new typeError(); }

        for (key in this) {
            if (this.hasOwnProperty(key)) {
                fn.call(this, this[key], key, this);
            }
        }
    }
    
    if (!Array.prototype.forEach) 
        Array.prototype.forEach = fe;
    }
    
    if (!Object.prototype.forEach) 
        Object.prototype.forEach = fe;
    }

})();


bob.forEach(function (val, i, arr) {
    console.log(val);    
    //console.log(i);    
    //console.log(arr);    
});


