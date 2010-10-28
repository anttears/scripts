//GROWLER
var yourNameSpace = {};

yourNameSpace.growl = (function () {
	// Set up our vars
	var cssHook = "page",
        gc = document.getElementById("growlContainer"), // GrowlContainer
        gl, //Growl UL 
        growls, // all li's in the  UL
        growlLife = 5800, // ms how long before a growl is removed from the page
        growlNo = 0, // gives a unique id to each growl li
        growlArray = new Array();
    //     ######                      #######
    //    ######   Helper functions   #######
    //   ######                      ######
    
    //Create DOM element
    function el(tag, attrs, content) {
        var el= document.createElement(tag);
        if (attrs!==undefined)
            for (var k in attrs)
                if (attrs.hasOwnProperty(k))
                    el[k]= attrs[k];
        if (content!==undefined) {
            if (typeof(content)==='string')
                el.appendChild(document.createTextNode(content));
            else
                for (var i= 0; i<content.length; i++)
                    el.appendChild(content[i]);
        }
        return el;
    };
        
    // Add events to the DOM  for onclicks to remove the growl
    function addEvent( obj, type, fn ) {
        if (obj.addEventListener) {
            obj.addEventListener( type, fn, false );
            EventCache.add(obj, type, fn);
        }
        else if (obj.attachEvent) {
            obj["e"+type+fn] = fn;
            obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
            obj.attachEvent( "on"+type, obj[type+fn] );
            EventCache.add(obj, type, fn);
        }
        else {
            obj["on"+type] = obj["e"+type+fn];
        }
    }
    
    var EventCache = function(){
        var listEvents = [];
        return {
            listEvents : listEvents,
            add : function(node, sEventName, fHandler){
                listEvents.push(arguments);
            },
            flush : function(){
                var i, item;
                for(i = listEvents.length - 1; i >= 0; i = i - 1){
                    item = listEvents[i];
                    if(item[0].removeEventListener){
                        item[0].removeEventListener(item[1], item[2], item[3]);
                    };
                    if(item[1].substring(0, 2) != "on"){
                        item[1] = "on" + item[1];
                    };
                    if(item[0].detachEvent){
                        item[0].detachEvent(item[1], item[2]);
                    };
                    item[0][item[1]] = null;
                };
            }
        };
    }();

    addEvent(window,'unload',EventCache.flush);    
    
    // Recursively get an elements parent till it's nodeName matches the one supplied
    function getParent(elem, type) {
        var returnElement = elem;
        type = type.toLowerCase();
        
        (function getP (elem) {
            var nn = elem.nodeName.toLowerCase();
            if(nn === type) {
                returnElement = elem;
            } else {
                if (elem.parentNode) {
                    getP(elem.parentNode);
                } else {
                    returnElement = null;
                }
            }
        })(elem);

        return returnElement;
    }
    
    // Set an element's opacity
    function setOpacity(elem, level) {
        if (elem.filters) {
            elem.style.filter = 'alpha(opacity=' + level + ')';
        } else {
            elem.style.opacity = level / 100;
        }
    }

    // remove an element from the DOM
    function remove (elem) {
        if(elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    }

    // Get the value of an element's CSS 
    function getStyle(oElm, strCssRule){
        var strValue = "";
        if(document.defaultView && document.defaultView.getComputedStyle){
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        }
        else if(oElm.currentStyle){
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }
        return strValue;
    }

    // Return an Element's height
    function getHeight(elem) {
        return elem.clientHeight || getStyle(elem, "height");
    }

    function getScrollPos() {
        var de = document.documentElement;
        return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
    }

    // FADE OUT
    function fadeOut(elem, callback) {
        for (var i = 100; i >= 0; i -= 5) {
            (function () {
                var pos = i;
                setTimeout (function () { setOpacity(elem, pos);}, ((100 - pos) * 3));
            })();
        }
        if (typeof(callback) == "function" ) {
            callback();
        }
    } 
    
    // FADE IN
    function fadeIn(elem, callback) {
        setOpacity(elem, 0);
        elem.style.display="";
        for (var i = 5; i <= 100; i += 5) {
            (function () {
                var pos = i;
                setTimeout (function () { setOpacity(elem, pos);}, (pos * 3));
            })();
        }
        if (typeof(callback) == "function" ) {
            callback();
        }
    }

    // Slide an Element up to 0 height
    function slideUp(elem, callback) {
        var h = parseInt(getHeight(elem)),
            c = Math.ceil((h / 5)),
            pt = parseInt(getStyle(elem, "padding-top")) / c,
            pb = parseInt(getStyle(elem, "padding-bottom")) / c;

        for (var i = 0; i <= c; i += 1) {
            (function () {
                var ii = i,
                    pos = (h - (ii * 5)),
                    newPb = pb * (pos/5),
                    newPt = pt * (pos/5);

                pos = (pos < 0) ? 0 : pos;

                setTimeout (function () {
                    elem.style.height = pos + "px";
                    elem.style.paddingTop = newPt + "px";
                    elem.style.paddingBottom = newPb + "px";
                    if (pos === 0){
                        elem.style.marginTop = 0;
                        elem.style.marginBottom = 0;
                        if (typeof(callback) == "function" ) {
                            callback();
                        }
                    }
                }, ((h - pos) * 3));
             })();
        }
        
    }

    //   ####                                  ####
    //  ####    BACK TO CODE FOR THE GROWLS   ####
    //  ####                                 ####

    //Function to close growls
	function closeGrowl (e, li, gid) {
        // Because a timer is set to close a growl, but it could also be closed by an onclick - we need to block close requests for
        // elements where one is already active. There's probably a neater way of doing this, but using clearTimeout doesn't quite get the job done
        if (e) {
            var t = (e.target || e.srcElement);
            li = getParent(t, "li");
            gid = li.getAttribute("id");
        }

        if (growlArray[gid]) {
            return false;
        } else {
            growlArray[gid] = true;
            fadeOut(li);
            slideUp(li, function () { remove(li); });
        }
	}


	//Onsetup, see if there is a growlContainer, else generate an empty one.
	if (gc) {
		// There are growls already, set the timer to remove them
		growls = gc.getElementsByTagName("li");
		var len = growls.length,
            i;
        // remove existing Growls
		for(i = 0; i < len; i += 1) {
            (function () {
                var pos = i,
                    li = growls[i],
                    gid = li.getAttribute("id"),
                    func = function () { closeGrowl(null, li, gid)};
                growlLife = growlLife + (i * 400); // stagger the growl disappearing
                setTimeout(func, growlLife);
            })();
		}
	} else {
		document.getElementById(cssHook).insertBefore(el("div", {id: "growlContainer"}, [
            el("ul", {id: "growlList"},"")
        ]), document.getElementById(cssHook).firstChild);
        
		gc = document.getElementById("growlContainer");
	}

    //At this point, gc exists on the page, so lets store the DOM reference to the growlList
    gl = document.getElementById("growlList");

	// Add event delegation for onclick
	addEvent(gc, "click", closeGrowl);    

    //   ####                                  ####
    //  ####          Return Fucntion         ####
    //  ####                                 ####

    // Now we've done all of the setup, return the function which can be called to create a growl.
    return function (className, heading, content) {
        // Set growl position to the top of the viewport
        var viewTop = getScrollPos() + 12,
            gid = "g" + growlNo,
            li,
            cg = function() { closeGrowl(null, li, gid)},
            sto = function() { setTimeout(cg, growlLife); },
            className = "growl " + className;
        
        if (!isNaN(viewTop)) {
            gc.style.top = viewTop + "px";
        }
        // Generate Growl
        gl.insertBefore(el('li', {id: gid, className: className}, [
            el('span', {className: 'close', title: 'close'}, 'x'),
            el('h2', {}, heading),
            el('div', {className: 'growlContent'}, content)
        ]), gl.firstChild);
        
        li = document.getElementById(gid);
        fadeIn(li, sto);
        growlNo +=1;
	}

})();        
