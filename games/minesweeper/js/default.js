function MineSweeper (c, r, b) {
    var cols = c,
        rows = r,
        bombs = b,
        tableFrag,
        attempt = 0,
        revealedCnt = 0,
        numberToReveal,
        grid = [],
        matrix = [[-1, -1],[0, -1],[1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
        gridObjs = [],
        gameOver = false,
        bombSquares = [];

    function generateGrid () {
        tableFrag = $('<table></table>').
            attr({"class": "ms"}).
            bind("click", clickSquare);

        for (var i = 0; i < rows; i += 1) {
            var tr = $('<tr></tr>'),
                r = "r" + i;

            for (var x = 0; x < cols; x += 1) {
                var c = "c" + x;
                grid.push(r + c);
                gridObjs[r + c] = {},
                gridObjs[r + c].type = "U",
                gridObjs[r + c].revealed = false,
                gridObjs[r + c].attempt = 0;

                var td = $('<td></td>')
                    .attr("id", r + c)
                    .appendTo(tr);
            }
            tr.appendTo(tableFrag);
        }
    }

    function clickSquare (e) {
        var td = $(e.target),
            rc = td.attr("id");

        if (td[0].nodeName !== "TD" || gameOver) { return; }
        attempt += 1;
        revealSquare(rc);
    }

    function revealBombs() {
        for (var i = 0; i < bombs; i += 1) {
            $("#" + bombSquares[i]).empty().append("B");    
        }    
    }

    function endGame (message) {
        gameOver = true;
        revealBombs();
        $(".ms").unbind("click");
        $('<h2></h2>').addClass("ms result").append(message).insertAfter("#mt");
    }

    function revealSquare (rc) {
        var len = matrix.length,
            sq = gridObjs[rc],
            type = sq.type,
            n = getNumbers(rc);
        
        if (sq.revealed !== true) {        
            $("#" + rc).append(type);
            sq.revealed = true;
            revealedCnt += 1;
        }

        if (type === "B") {
            endGame("Sorry, you lose.");
            return;
        }


        for (var i = 0; i < len; i += 1) {
            var m = matrix[i],
                newR = n[0] + m[0],
                newC = n[1] + m[1],
                newrc = "r" + newR + "c" + newC,
                sqn = gridObjs[newrc];

            if ((newR > -1 && newR < rows) && (newC > -1 && newC < cols) && sqn.attempt < attempt && !sqn.revealed && sqn.type !== "B") {
                var t = sqn.type;
                sqn.attempt = attempt;

                sqn.revealed = true;
                revealedCnt += 1;
                $("#" + newrc).append(t); 
                
                if (t === 0) {
                    revealSquare(newrc);
                }
            }
        }
 
        if (revealedCnt === numberToReveal) {
            endGame("Well played, you won");
            return;
        }    
    }

    function placeBombs () {
        var list = grid.slice();
        for (var i = 0; i < bombs; i += 1) {
            var num = Math.floor(Math.random() * list.length),
                rc = list[num];
            //tableFrag.find("#" + sq).append("B");
            gridObjs[rc].type = "B";
            bombSquares.push(rc);
            list.splice(num, 1);
        }
    }

    function setNumbers (r, c) {
        var cnt = 0,
            rc = "r" + r + "c" + c,
            len = matrix.length;
        
        for (var i = 0; i < len; i += 1) {
            var m = matrix[i],
                newR = r + m[0],
                newC = c + m[1],
                newrc = "r" + newR + "c" + newC;

            if ((newR > -1 && newR < rows) && (newC > -1 && newC < cols)) {
                if (gridObjs[newrc].type === "B") {cnt += 1;}
            }
        }
        
        //tableFrag.find("#" + rc).append(cnt);
        gridObjs[rc].type = cnt;
    }

    function getNumbers (sq) {
        var arr = sq.match(/r([0-9]+)c([0-9]+)/),
            r = parseInt(arr[1]), 
            c = parseInt(arr[2]);
            return[r, c];
    }

    function makeGridObjs () {
        var len = grid.length;
        for (var i = 0; i < len; i += 1) {
            var sq = grid[i],
                obj = gridObjs[sq];
            if (obj.type !== "B") {
                var n = getNumbers(sq);
                setNumbers(n[0], n[1]);
            }
        }
    }

    this.init = function () {
        generateGrid();
        placeBombs();
        makeGridObjs();
        $("#mt").after(tableFrag);
        numberToReveal = grid.length - bombs;
    }
}


$("document").ready(function () {
    $("#gridForm").bind("submit", function () {
        $(".ms").remove();
        var form = $(this),
            cols = form.find("#cols").val(),
            rows = form.find("#rows").val(),
            bombs = form.find("#bombs").val(),
            ms = new MineSweeper(cols, rows, bombs);
        ms.init();
        return false;
    });
});
