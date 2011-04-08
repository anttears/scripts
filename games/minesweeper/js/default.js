function MineSweeper (c, r, b) {
    var cols = c,
        rows = r,
        bombs = b,
        tableFrag,
        gridSquares = r * c,
        attempt = 0,
        revealedCnt = 0,
        numberToReveal,
        grid = [],
        matrix = [[-1, -1],[0, -1],[1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
        gridObjs = [];

    function generateGrid () {
        tableFrag = $('<table></table>').attr({
            "class": "ms"    
        });
        for (var i = 0; i < rows; i += 1) {
            var tr = $('<tr></tr>');
            var r = "r" + i;
            for (var x = 0; x < cols; x += 1) {
                var c = "c" + x;
                    grid.push(r + c);
                    gridObjs[r + c] = {},
                    gridObjs[r + c].type = "U",
                    gridObjs[r + c].revealed = false,
                    gridObjs[r + c].attempt = 0;

                var td = $('<td></td>')
                    .attr("id", r + c)
                    .appendTo(tr)
                    .bind("click", clickSquare);
            }
            tr.appendTo(tableFrag);
        }
    }

    function clickSquare () {
        var td = $(this),
            rc = td.attr("id");
        attempt += 1;
        revealSquare(rc);
    }

    function revealSquare (rc) {
        var len = matrix.length,
            sq = gridObjs[rc],
            type = sq.type,
            n = getNumbers(rc);

        if (type === "B") {
            alert("Game Over");
            return;
        }

        if (revealedCnt === numberToReveal - 1) {
            alert("winner");
            return;
        }

        if (sq.revealed !== true) {        
            $("#" + rc).append(type);
            sq.revealed = true;
            revealedCnt += 1;
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
                    console.log("t = 0: " + newrc);
                    revealSquare(newrc);
                }
            }
        }
 
    }

    function placeBombs () {
        var list = grid.slice();
        for (var i = 0; i < bombs; i += 1) {
            var num = Math.floor(Math.random() * list.length),
                sq = list[num];
            tableFrag.find("#" + sq).append("B");
            gridObjs[sq].type = "B";
            list.splice(num, 1);
        }
    }

    function bombNumbers (r, c) {
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

    function makeObj () {
        var len = grid.length;
        for (var i = 0; i < len; i += 1) {
            var sq = grid[i],
                obj = gridObjs[sq];
            if (obj.type !== "B") {
                var n = getNumbers(sq);
                bombNumbers(n[0], n[1]);
            }
        }
    }

    this.init = function () {
        generateGrid();
        placeBombs();
        makeObj();
        $("#mt").after(tableFrag);
        numberToReveal = grid.length - bombs;
    }
}


$("document").ready(function () {
    $("#gridForm").bind("submit, click", function () {
        var form = $(this),
            cols = form.find("#cols").val(),
            rows = form.find("#rows").val(),
            bombs = form.find("#bombs").val(),
            ms = new MineSweeper(cols, rows, bombs);
        ms.init();
        return false;
    });
});
