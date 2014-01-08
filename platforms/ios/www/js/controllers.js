// ----------------------------------
// SESSION
// ----------------------------------
JagerBondsApp.SessionController = Ember.Controller.extend({
    token: null,
    username: null,

    isLoggedIn: function() {
        return !!this.get("token");
    }.property("token")
});


// ----------------------------------
// APPLICATION
// ----------------------------------
JagerBondsApp.ApplicationController = Ember.Controller.extend({
    showNav: false,
    title: "JAGERBONDS",
    logoTitle: true,
    logoUrl: 'img/icons/jager-logo-sm.png',
    leftBtn: false,
    rightBtn: false,

    needs: "session",
    isLoggedInBinding: "controllers.session.isLoggedIn",
    usernameBinding: "controllers.session.username",

    showSignIn: function(signIn){
        this.transitionToAnimated('sign-in', {main: 'slideLeft'});
    }
});


// ----------------------------------
// SIGN IN
// ----------------------------------
JagerBondsApp.SignInController = Ember.Controller.extend({
    needs: ['application'],
    init: function() {
        title: Ember.computed.alias("controllers.application.title"),

        this.get('controllers.application').set('showNav', true);
        this.get('controllers.application').set('logoTitle', true);
    }
});


// ----------------------------------
// USER
// ----------------------------------
JagerBondsApp.UserController = Ember.ObjectController.extend({
    isLoggedIn: false,

    actions: {
        registerNewUser: function(){
            $.post( "http://jagerbonds.mry.com/api/user", {id:userId, facebookToken:access_token} );
        }
    },

    model: function(){
        return $.getJSON('db/getJSON/');
    }
});


// ----------------------------------
// DASH
// ----------------------------------
JagerBondsApp.DashController = Ember.Controller.extend({
    needs: ['application'],
    init: function() {
        this.get('controllers.application').set('showNav', true);
        this.get('controllers.application').set('logoTitle', true);
        this.get('controllers.application').set('rightBtn', true);
    },

    logoTitle: true,
    leftBtn: false,
    rightBtn: true
});


// ----------------------------------
// BOND
// ----------------------------------
JagerBondsApp.BondController = Ember.Controller.extend({
    bonds: function(signIn){
        this.transitionToAnimated('sign-in', {main: 'slideLeft'});
    }
});


// ----------------------------------
// SONGS
// ----------------------------------
JagerBondsApp.SongsController = Ember.Controller.extend({
    model: function(){
        return $.getJSON('http://jagerbonds.mry.com/api/song');
    }
});