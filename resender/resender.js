/*
I found myself recently sending status updates to a server, which did not require a response.
However, it was important information and I really wanted to know that the server had received my update.
So I wrote the following resender code:
I call sendStatus with my status information as JSON in postData,
I then kickoff a resender, which sets a timer to post the same request repeatedly,
the timer continues to resend my data until I get a response from the server, either a success or an error,
this way, I know that my post hasn't been lost in the aether.
It's probably overkill for most ajax requests which are fire and forget, but when keeping the serverside synched with the front end, its a nice bit of extra insurance.

I've been keeping a log in my actual code and I'm suprised how often it actually takes 2 tries to get the message through.
This is an untested simile of the code I'm using, so please let me know of any flaws. You will need to modify this code to use your prefered post function.
Please note, I am not using jQuery to post my data...
*/



function ResendStatus () {
    var shell = this;
    this.timer = function (postData) {
        shell.resend = setTimeout(function () { sendStatus(postData); }, 1800);
    };

    this.stopTimer = function () {
        clearInterval(this.resend);
    };
}

function sendStatus (postData) {
    // create a new instance of the resender
    var resender = new ResendStatus();
    // kick start the timer
    resender.timer(postData);
    
    var onSuccess = function () {
        resender.stopTimer();
    }

    var onError = function (st) {
        resender.stopTimer();   
        throw new Error("Error sending state");
    };
    
    // Adapt to use your prefered ajax library
    $.postJSON(URL, onSuccess, postData, onError);
}
