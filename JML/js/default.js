(function () {
    /////////////////////////////////////////
    //  EVENTS  
    /////////////////////////////////////////
    var events = (function () {
        var events = {};

        function isLink (elem, url) {
            var ajax = new aj.Call(url);
            ajax.init();
        }

        function hijax (e) {
            var tgt = $(e.target),
                url = tgt.attr("href"),
                linkType = tgt.attr("rel"),
                depth = 4,
                i = 0;

            while ((url === undefined || url === null) && tgt.parent()[0].nodeName !== "BODY" && i < depth) {
                tgt = tgt.parent();
                url = tgt.attr("href");
                linkType = tgt.attr("rel");
                i += 1;
            }

            if (url !== undefined && url !== null && linkType !== "external") {
                isLink(tgt, url);
                e.preventDefault();
            }
        }


        events.init = function () {
            $("#page").bind("click", hijax);
        };

        return events;
    })();



    /////////////////////////////////////////
    //  AJAX FUNCTIONS 
    /////////////////////////////////////////
    window.aj = (function () {
        var aj = {},
            q = 0;

        function addToQ () {
            q += 1;
        }

        function removeFromQ () {
            q = (q === 0) ? 0 : q -= 1;    
        }

        function checkQ () {
            return q <= 5;
        }


        aj.Call = function (url) {
            if (!url) { throw new Error("Url is required for ajax calls")};
            if (!checkQ()) { 
                var errorObj = {}; 
                errorObj.init = function () { alert("This request was not sent - currently too many requests in the queue."); }; 
                return errorObj; 
            };

            addToQ();

            this.url = url;
            this.type = "GET";
            this.dataType = "JSON";
            this.success = function (ajaxContent, params) {
                var dto = JmlObj(ajaxContent, params);
                console.log(dto);
                dto.handleContent();
            };

            var shell = this;
            this.init = function () {
                get(shell);
            };
        };
        
        function get (options) {
            $.ajax({
                url: options.url,
                type: "GET",
                dataType: options.dataType,
                beforeSend: function () {
                    if (options.loading) {
                        //alert("show loading");
                        return;
                    }
                },
                success: function (ajaxContent, textStatus) {
                    options.success(ajaxContent, options.params);
                    removeFromQ();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Ajax error: " + errorThrown);
                    removeFromQ();
                }
            });
        }

        return aj;
    })();
    events.init();
})();
