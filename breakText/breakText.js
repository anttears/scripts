/* This was originally written as part of code to make the labels for a graph tool, but I thought it might be useful for other things...
It was originally called when a specific label was larger than the space allocated to it - this code then looks for spaces in the label,
it returns the same text with the spaces replaced by \n line ends if the previous word was over n characters long, so the the label "first of a long list"
would be shortened to:
first
of a long
list

rather than
first
of
a
long 
list

*/

function breakOnSpace (label) {
    var len = label.length,
        i = 0,
        pi = 0; // position of previous space
    
    while (i !== -1) {
        i = label.indexOf(" ", (i + 1)); // start at the next character after a match - i could be set to -1 if you neec to check the first character of your string
        if ((i - pi) > 4) { // if the current space is more than 4 characters from the next one
            label = label.substr(0, i) + '\n' + label.substr(i + 1);                        
        } 
        pi = i;
    }
    return label;
}
