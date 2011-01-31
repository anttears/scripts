//     ######                      #######
//    ######   Helper functions   #######
//   ######                      ######

// Add events to the DOM  
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


// ADD LOAD EVENT
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	}
	else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}


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

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\\\s)'+searchClass+'(\\\\s|$)');
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function $() {
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);
		if (arguments.length == 1)
			return element;
		elements.push(element);
	}
	return elements;
}

function typeofPrim (prim) {
    if (!prim) return "null";
    var obj = {};
    var type = obj.toString.call(prim).split(" ")[1];
    type = type.substring(0, type.length - 1);
    return type;
}
