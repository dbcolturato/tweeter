/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// loops through tweets
// calls createTweetElement for each tweet
// takes return value and appends it to the tweets container
const renderTweets = function (tweets) {
  $('#tweets-container').empty();
  for (const tw of tweets) {
    $('#tweets-container').prepend(createTweetElement(tw));
  }
}

//load all the tweets on the page
const loadtweets = function () {
  $.ajax({
    url: "/tweets",
    method: "GET",
  }).then((posts) => {
    renderTweets(posts);
  }).catch(err => console.log(err));
}

//toggle form
const toggleform = function () {
  if ($('.new-tweet').css('display') === 'none') {
    $('.new-tweet').slideDown("slow");
  } else {
    $('.new-tweet').slideUp("slow");
  }
}

//gets a text describing the age of the tweet
const getTweetAge = function (tweet) {
  const secondsAgo = Math.trunc((Date.now() - tweet.created_at) / 1000);
  if (secondsAgo < 60) {
    return secondsAgo + " seconds ago";
  }
  if (secondsAgo < 3600) {
    return Math.trunc(secondsAgo / 60) + " minutes ago";
  }
  if (secondsAgo < 86400) {
    return Math.trunc(secondsAgo / 3600) + " hours ago";
  }
  return Math.trunc(secondsAgo / 86400) + " days ago";
}

//create each tweet container
const createTweetElement = function (tweet) {
  return $(
    '<article class="tweet">' +
    '<header>' +
    '<div class="user">' +
    `<div><img class="photo" src="${tweet.user.avatars}"></div>` +
    `<div>${tweet.user.name}</div>` +
    '</div>' +
    `<div class="handle">${tweet.user.handle}</div>` +
    '</header>' +
    '<section class="tweet-text">' +
    $('<div>').text(tweet.content.text).html() +
    '</section>' +
    '<footer>' +
    `<div>${getTweetAge(tweet)}</div>` +
    "<div>" +
    '<i class="fas fa-flag"></i>' +
    '<i class="fas fa-retweet"></i>' +
    '<i class="fas fa-heart"></i>' +
    '</div>' +
    '</footer>' +
    '</article>'
  );
}

//verify the new tweet content is valid and post it to the server
const postTweet = () => {
  const tweetText = $("#tweet-text").val();

  // check for empty message
  if (!tweetText) {
    $('#error').html(`<i class="fas fa-exclamation-triangle"></i> Your tweet is empty, type something <i class="fas fa-exclamation-triangle"></i>`);
    $('#error').slideDown("slow");
    return;
  }

  // check for maximum tweet size
  if (tweetText.length > 140) {
    $('#error').html(`<i class="fas fa-exclamation-triangle"></i> Your tweet exceeded the maximum size <i class="fas fa-exclamation-triangle"></i>`);
    $('#error').slideDown("slow");
    return;
  }

  // hide the error message
  $('#error').slideUp("slow");

  $.ajax({
    url: "/tweets",
    method: "POST",
    data: $("#tweet-form").serialize()
  }).then(() => {
    loadtweets();
    $('#tweet-text').val("");
    $('#counter').val(140);
  }).catch(err => console.log(err));
};

$(document).ready(() => {
  $("#tweet-form").submit(function (event) {
    event.preventDefault();
    postTweet();
  });

  loadtweets();
});
