define([
    'jquery',
    'prototype'
], function($j, prototype) {

    var SocialPopup = Class.create();
    SocialPopup.prototype = {
        initialize: function(data) {
            this.fasebookUrl = data.fasebookUrl;
            this.instagramUrl = data.instagramUrl;
        },
        openFacebookPopup: function(current) {
            var fasebookUrl = this.fasebookUrl;
            window.open(fasebookUrl, "Facebook", 'height=500,width=900,scrollbars=yes');
        },
        openInstagramPopup: function(current) {
            var instagramUrl = this.instagramUrl;
            window.open(instagramUrl, "InstaGram", 'height=500,width=900,scrollbars=yes');
        },
    }

    return SocialPopup;
});