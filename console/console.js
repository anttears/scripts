(function () {
    if (!window.console) {
        window.console = {};

        window.console.log = function (text) {
            var content = "";
            content = enumObj(text, true);
            var li = '<li class="fc tal m_12">' + content + '</li>';
            showPanel(li);
        }

        function makePanel(li) {
            var ul = create("ul", "rc6", "consolePanel");
            append(li, ul);
            return ul;
        }

        function showPanel(li) {
            var panel = document.getElementById("consolePanel");
            if (panel) {
                append(li, panel);
            } else {
                var ul = makePanel(li);
                document.getElementsByTagName("body")[0].appendChild(ul);
            }
        }

        function makeHeader(obj) {
            var objType = (obj instanceof Array) ? "Array" : "Object",
            header = '<h2>' + objType + ' details:</h2>';
            return header;
        }


        //Enumerate through the contents, searching endlessly for objects
        function enumObj(obj, requireHeader) {
            var len, content = "";
            if (typeof (obj) === "object") {
                if (requireHeader) { // Make a header if first pass through the function
                    content += makeHeader(obj) 
                } 

                content += '<ul class="consoleObjList">';
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        content += '<li><span>' + key + '</span>: ' + enumObj(obj[key], false) + '</li>';
                    }
                }

                content += '</ul>';

            } else {
                //treat it as a string
                content = escapeHTML(obj);
            }
            return content;
        }

        // Helpers

        // escape the html for your viewing pleasure
        function escapeHTML(str) {
            var div = create('div');
            var text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        }

        function append(string, elem) {
            var content = elem.innerHTML;
            content += string;
            elem.innerHTML = content;
        }

        function create(elem, className, id) {
            var e = document.createElement(elem);
            e.className = className;
            e.id = id;
            return e;
        }

    }
})();

