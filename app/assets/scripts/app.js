
/**
 * Smash targets below this line
 * -----------------------------
 */

(function(win, doc, _) {

    'use strict';

    var util = {},
        tweets = [],

        $handle = $('#twitter-handle'),
        $tweets = $('#tweets'),
        $notLoggedIn = $('#not-logged-in'),
        $refresh = $('a.refresh'),

        template = _.template($('#tweet-template').html()),
        dummy = {
            tweet_id: "123456",
            avatar_url: '/assets/img/avatar.png',
            display_name: 'Dave Hurricane',
            twitter_handle: '@davehurricane',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, illo quidem consequuntur inventore aliquid ab, sunt repellendus fugit blanditiis facere facilis.'
        };


    function init() {

        // Try and populate the tweets array. If the response is empty then
        // we know the user is not logged in.
        $.getJSON('/api/tweets', function(response){
            console.log(typeof response);
            if ( typeof response === 'object' ) {
                parseTweets(response);
            }
        }, function(err){
            console.log('error', arguments);
        });
    }

    function parseTweets(list) {

        for ( var i in list ) {
            tweets.push(template(list[i]));
        }

        // for ( var i = 0, l = 6; i < l; i++ ) {
        //     tweets.push(template(dummy));
        // }

        render();
        showTweets();
    }

    function render() {
        $tweets.html('');
        for ( var i in tweets )  {
            $tweets.append(tweets[i]);
        }
    }

    function showTweets() {
        $tweets.show();
    }

    function updateTwitterHandle(handle) {
        $handle.text(handle);
    }

    // DOM has loaded, fire off the init function.
    $(init);

})(window,document, _);
