
/**
 * Sennep Coding Test.
 * -----------------------------
 */

(function(win, doc, $, _) {

    'use strict';

    var tweets = [],
        $handle = $('#twitter-handle'),
        $tweets = $('#tweets'),
        $notLoggedIn = $('#not-logged-in'),
        $refresh = $('a.refresh'),
        template = _.template($('#tweet-template').html());

    /**
     * When the DOM has finished loading, this function is fired.
     * Gets the tweets and binds an event listener on the refresh button.
     */
    function init() {
        getTweets();
        $refresh.on('click', getTweets);
    }

    /**
     * This makes a request for the favourited tweet data, and responds
     * accordingly if there are errors / user not logged in.
     */
    function getTweets() {

        // Reset our structure
        tweets = [];
        $tweets.html('');

        // Make a request to the server
        $.getJSON('/api/tweets', function(response){

            if ( 'tweets' in response ) {
                $handle.text(response.user);
                parseTweets(response.tweets);
            } else if ( 'message' in response ) {
                console.log(response.message);
            }

        }, function(err){
            console.log('error', arguments);
        });
    }

    /**
     * Iterates through the list of tweets returned from the server
     * and compiles each one into a template, then appends it to the
     * tweet list in the DOM.
     */
    function parseTweets(list) {

        var i;

        for ( i in list ) {
            tweets.push(template(list[i]));
        }

        for ( i in tweets )  {
            $tweets.append(tweets[i]);
        }

        $tweets.show();
    }

    // DOM has loaded, fire off the init function.
    $(init);

})(window,document, jQuery, _);
