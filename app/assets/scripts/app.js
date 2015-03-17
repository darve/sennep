
/**
 * Smash targets below this line
 * -----------------------------
 */

(function(win, doc, _) {

    'use strict';

    var util = {},
        tweets = [],

        template = _.template($('#tweet-template').html()),
        $tweets = $('#tweets'),
        $notLoggedIn = $('#not-logged-in'),
        $refresh = $('a.refresh');

    window.template = $('#tweet-template').html();
    window.dummy = {
        tweet_id: "123456",
        avatar_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2014-10-28/2884805237_48.jpg',
        display_name: 'Dave Hurricane',
        twitter_handle: '@davehurricane',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, illo quidem consequuntur inventore aliquid ab, sunt repellendus fugit blanditiis facere facilis.'
    }


    function init() {

        // Try and populate the tweets array. If the response is empty then
        // we know the user is not logged in.
        $.getJSON('/api/tweets', function(response){
            console.log(response);
            if ( response === 'Not logged in' ) {
                showLoginMessage();
            } else {
                console.log(response);
                showLoading();
                parseTweets(response.tweets);
            }
            parseTweets(response.tweets);
        }, function(err){
            console.log('error', arguments);
        });
    }

    function parseTweets(list) {

        // for ( var i in list ) {
        //     // tweets.push(_.template(template, list[i]));
        // }

        for ( var i = 0, l = 6; i < l; i++ ) {
            tweets.push(template(dummy));
        }

        render();
        showTweets();
    }

    function render() {
        $tweets.html('');
        for ( var i in tweets )  {
            $tweets.append(tweets[i]);
        }
    }

    function showLoading() {

    }

    function showTweets() {
        $tweets.show();
        $notLoggedIn.hide();
    }

    function showLoginMessage() {
        $notLoggedIn.show();
        $tweets.hide();
    }

    // DOM has loaded, fire off the init function.
    $(init);

})(window,document, _);
