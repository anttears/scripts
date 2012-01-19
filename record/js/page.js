(function () {
    var divClick = function (e) {
        e.preventDefault();
        alert("Div click! That shit just happened.");
    };

    var linkClick = function (e) {
        e.preventDefault();
        alert("Link click! BAMMM.");
    };

    var init = function () {
        var div = document.getElementById("div");
        div.addEventListener("click", divClick, false);

        var linky = document.getElementsByTagName("a");
        var len = linky.length;
        var i;

        for (i = 0; i < len; i += 1) {
            var link = linky[i];
            link.addEventListener("click", linkClick, false);
        }
    };

    document.addEventListener ("DOMContentLoaded", init, false);
}());
