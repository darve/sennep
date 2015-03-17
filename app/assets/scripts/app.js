
/**
 * Smash targets below this line
 * -----------------------------
 */

(function(win, doc, _) {

    'use strict';

    var util = {},
        tweets = [];


    function init() {

        // Try and populate the tweets array. If the response is empty then
        // we know the user is not logged in.
        $.get('/api/tweets', function(response){
            console.log(response);
        }, function(err){
            console.log('error', arguments);
        });
    }


    function render() {

    }


    // DOM has loaded, fire off the init function.
    $(init);

})(window,document, _);
