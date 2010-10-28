//GROWLER
var yourNameSpace = {};

yourNameSpace.growl = (function () {
	// Set up our vars
	var gc = $("#growlContainer"), // GrownContainer
	    gl, //Growl ul jquery object
	    growls, // all the li's in the gl
	    growlMarkup = "",
	    growlLife = 1200, // length gorwls stay on screen
        cssHook = "#page";
	
    //Onsetup, see if there is a growlContainer, else generate an empty one.
	if(gc.length) {
		// There are growls already, set the timer to remove them
		growls = gc.find("li.growl");
		growls.each(function (index) {
			var li = $(this),
			    func;

			growlLife = growlLife + (index  * 400); // stagger the growl disappearing
			func = function () { closeGrowl(null, li)}
			setTimeout(func, growlLife);			
		});
	} else {
		growlMarkup = '<div id="growlContainer"><ul id="growlList"></ul></div>';
		$(cssHook).prepend(growlMarkup);
		gc = $("#growlContainer");
	}

	//Function to close growls
	function closeGrowl (e, li) {
		if (e) {
			li = $(e.target).closest("li");
		}
        li.fadeTo("slow", 0).slideUp("slow", function () {
            $(this).remove();
        });
	}

	//Now we definitely have a growlList on the page, lets store the DOM ref and add event delegation for onclick
	gl = gc.find("#growlList");

    // Event handler to remove growl immediately on click
	gl.bind("click", closeGrowl);
    

	// Now we've done all of the setup, return the function which can be called to create a growl.
    return function (className, heading, content) {
        // Set growl position to the top of the viewport
        var viewTop = $(window).scrollTop() + 12;
        if (!isNaN(viewTop)) {
            gc.animate({
                top: viewTop + "px"
            }, 400);
        }
        // Generate Growl
        var growl = '<li class="' + className + ' growl" style="display: none"><span class="close" title="close">x</span><h2>' + heading + '</h2><div class="growlContent">' + content + '</div></li>';
        gl.prepend(growl).find("li.growl").eq(0).fadeIn("slow", function () {
       	    var li = $(this),
			    func;

			func = function () { closeGrowl(null, li)}
			setTimeout(func, growlLife);	
        });
    }

})();
