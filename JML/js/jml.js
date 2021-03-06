localStorage.clear();

//////////////
// Please note: jml is not intended to be used in the wild as a global variable. It should be used in a closure.
// I have presented it in this manner here simply to allow it to exist in a separate file.
// It will need some integration into your existing framework - for example, getTemplateFromServer currently uses a custom ajax handler not included,
// these functions have been highlighted in the code
////////////

var JmlObj = (function () {
    function Jml (ajaxContent, params) {
        this.aj = ajaxContent;
        this.options = params;

        //////////////////////////
        ///  Content
        function addAttributes (elem, attributes) {
            _.each(attributes, function (key, value) {
                elem.setAttribute(key, value);
            });

            console.log(elem);
            
            return elem;
        };

        function innerParse (jml, elem) {
            return elem;
        };

        function processCommand (jcl) {
            var content = jcl.content.content,
                JML = jcl.template.JML;
            
            var nextJML = JML.innerJML,
                elem = document.createElement(JML.element),
                attr = JML.attributes;

            console.log(JML);

            if (attr) {
                elem = addAttributes(elem, attr);
            }
            if (nextJML) {
                elem = innerParse(nextJML, elem);
            }
            console.log(elem);
        };

        //////////////////////////
        ///  Templates
        function storeTemplate (jml, jcl, callback) {
            var jmlString = JSON.stringify(jml);
            localStorage.setItem(jcl.content.feature, jml);
            jcl.template = jml;

            callback(jcl);
        };

        function getTemplateFromServer (jcl, callback) {
            var feature = jcl.content.feature,
                url = "stubbs/JML/" + feature + ".js",
                ajax = new window.aj.Call(url);

            ajax.params = {"jcl": jcl, "callback": callback};
            ajax.success = function (ajaxContent, params) {
                storeTemplate(ajaxContent, params.jcl, params.callback);
            }
            ajax.init();
        };

        function checkTemplates (jclArray) {
            _.each(jclArray.content, function (content) {
                // separate the content objects from the array and get the appropriate template
                var jcl = {},
                    feature = content.feature,
                    t = localStorage.getItem(feature);

                jcl.action = jclArray.action;
                jcl.content = content;
                jcl.template = t;

                if (!t) {
                    console.log("Getting template from server");
                    getTemplateFromServer(jcl, processCommand);
                } else {
                    console.log("Getting template from local storage");
                    processCommand(jcl);
                }
            });
        };

        this.handleContent = function () {
            var aj = this.aj;

            if (!aj) {
                throw new Error("This JML object has no content and cannot continue.");
            }

            _.each(aj, function (value, key) {
                // separate the action (insert, delete, append or amend) from the array of content objects
                var jclArray = {};
                jclArray.action = key;
                jclArray.content = value;

                switch (key) {
                    case "insert":
                        checkTemplates(jclArray);
                        break;

                    default: 
                        throw new Error("Unknown action type");
                }
            });
        };
    }


    var Jml2 = {
        handleContent: function () {
            console.log("woop");
        }
    }
    return function (ajaxContent, params) {
        var F = function () {};
        F.prototype = Jml2;
        return new F;
    }
})();
