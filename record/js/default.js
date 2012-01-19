var rec = (function () {
    var rec = {};
    rec.store = {};

    //getPosition
    getPosition = function (el, nodeName) {
        var p = el.parentNode,
            elems = p.getElementsByTagName(nodeName),
            len = elems.length,
            i,
            pos;

        for (i = 0; i < len; i += 1) {
            if (elems[i] === el) {
                pos = i;
                break;
            }
        }        

        return pos;
    };

    //getId
    getId = function (e) {
        var tgt = e.target,
            path = [],
            pathElement,
            id;

        while (tgt.nodeName !== "BODY") {
            id = tgt.getAttribute("id"),
                nodeName = tgt.nodeName;

            if (!id) {
                pathElement = nodeName + "[" + getPosition(tgt, nodeName) + "]";
                path.push(pathElement);
            } else {
                path.push("#" + id);
                return path;
            }
            tgt = tgt.parentNode;
        }

        return path;
    };

    // saveEvent
    saveEvent = function (e) {
        var tgt = e.target,
            id = getId(e),
            eventType = e.type
            url = document.location.href;

        rec.store[url] = {
            "eventType": eventType,
            "path": id
        }

        console.log(e);
        console.log(id);
        console.log(eventType);
        console.log(url);
    };



    
    // *****************************************
    // PLAY BACK's A BITCH
    // *****************************************

    var getElement = function (path) {
        var len = path.length,
            id,
            elem;

        if (len === 1) {
            id = path[0].slice(1);
            return document.getElementById(id);
        }

        return id;
    };
    
    rec.play = function () {
        var url = document.location.href,
            pastEvent = rec.store[url],
            elem,
            evt = document.createEvent("MouseEvent");

        if (pastEvent === undefined) {
            throw new Error("Nothing stored against this location");
        }

        elem = getElement(pastEvent.path);

        console.log(elem);

        evt.initMouseEvent(pastEvent.eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        elem.dispatchEvent(evt);
    };



    

    // Start this muthafucka on up
    init = function () {
        document.addEventListener("click", saveEvent, true);
    };

    init();

    return rec;
}());
