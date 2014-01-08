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
    showFooter: true,
    title: "JAGERBONDS",
    logoTitle: true,
    logoUrl: 'img/icons/jager-logo-sm.png',
    leftBtn: false,
    rightBtn: false,
    showBottomNav: false,
    leftBottomBtnLabel: null,
    rightBottomBtnLabel: null,

    needs: "session",
    isLoggedInBinding: "controllers.session.isLoggedIn",
    usernameBinding: "controllers.session.username",

    // Actions
    actions : {
        showSignIn: function(signIn){
            this.transitionToRouteAnimated('sign-in', {main: 'fade'});
        }

        ,goTo_next              : null
        ,goTo_back              : null
        ,rightBtnClick          : null
    }
});


// ----------------------------------
// AGE GATE
// ----------------------------------
JagerBondsApp.AgeGateController = Ember.Controller.extend({
    // Actions
    actions : {
        goToDash : function(){
            this.transitionToRouteAnimated('dash', {main: 'fade'});
        }
    }
});



// ----------------------------------
// SIGN IN
// ----------------------------------
JagerBondsApp.SignInController = Ember.Controller.extend({
    needs: ['application'],

    actions : {
        init: function() {
            var appController = this.get('controllers.application');

            title: Ember.computed.alias("controllers.application.title"),

                appController.setProperties({
                    showNav                 : true
                    ,logoTitle               : true
                });
        }
    }
});

JagerBondsApp.BondsController = Ember.Controller.extend({
});

// ----------------------------------
// DASH
// ----------------------------------
JagerBondsApp.DashController = Ember.ArrayController.extend({
    loggedIn: false,
    hasInvites: false,
    needs: ['application', 'bonds'],

    actions : {
        init: function() {

            var appController = this.get('controllers.application');

            appController.setProperties({
                 showNav                : true
                ,logoTitle              : true
//                ,rightBtn               : true
                ,leftBtn                : false
                ,showBottomNav          : false
                ,showFooter             : false

                ,rightBtnClick          : function(){ this.transitionToRouteAnimated('settings', {main: 'slideLeft'}); }
            });
        }

        ,goToCreateBond: function(){
            this.transitionToRouteAnimated('create', {main: 'slideLeft'});
        }

        ,goToEnterBondCode: function(){
            this.transitionToRouteAnimated('enter-code', {main: 'slideLeft'});
        }

        ,login: function(){
            var bondsController = this.get('controllers.bonds');
            var appController = this.get('controllers.application');

            //console.log("inside action");
            login(this, appController, bondsController); // Calls login function from facebook.js
        }

        ,goToDetails : function(bond_id){
            this.transitionToRouteAnimated("bond-detail", {main: 'slideLeft'}, bond_id);
        }

//        ,logout: function(controller){
//            fbLogout(controller, this); // Calls logout function from facebook.js
//            this.set('loggedIn', true);
//        }
    }
});






// ----------------------------------
// CREATE
// ----------------------------------
JagerBondsApp.CreateController = Ember.ArrayController.extend({
    trackPlaying: 0,
    showBottomNav: true,
    needs: ['application'],

    actions: {
        init: function() {

            var appController = this.get('controllers.application');

            appController.setProperties({
                 showNav                : true
                ,rightBtn               : false
                ,leftBtn                : false
                ,title                  : "CREATE THE BOND"
                ,logoTitle              : false
                ,showBottomNav          : true
                ,leftBottomBtnLabel     : "BACK"
                ,rightBottomBtnLabel    : "ADD FRIENDS"
                ,showFooter             : false

                ,goTo_next              : function(){ this.transitionToRouteAnimated('friendlists', {main: 'slideLeft'}); }
                ,goTo_back              : function(){ this.transitionToRouteAnimated('dash', {main: 'slideRight'}); }
            });
        },


        playPauseSong: function(trackNum, controller)
        {
            var soundtrackPlayer = document.getElementById("soundtrackPlayer");
                soundtrackPlayer.preload = "auto";
                soundtrackPlayer.volume = 1.000000;

            var btns = document.getElementsByClassName("playPauseBtn");

            if ( controller.trackPlaying !== 0 )//----------------------------------------------------------------------is there something currently playing?
            {
                btns[controller.trackPlaying-1].className = "playPauseBtn isNotPlaying";

                if ( controller.trackPlaying == trackNum )//-------------------------------------------------------------is it the same trackNum? then pause.
                {
                    soundtrackPlayer.pause();
                    soundtrackPlayer.src = '';
                    controller.set( "trackPlaying", 0);
                } else {//----------------------------------------------------------------------------is it not the same trackNum? then change src and play.
                    soundtrackPlayer.src = this.content[trackNum-1].url;
                    soundtrackPlayer.load();
                    soundtrackPlayer.play();
                    btns[trackNum-1].className = "playPauseBtn isPlaying";
                    controller.set( "trackPlaying", trackNum);
                }
            } else {   //-------------------------------------------------------------------------------------nothing is currently playing. set src and play.
                soundtrackPlayer.src = this.content[trackNum-1].url;
                soundtrackPlayer.load();
                soundtrackPlayer.play();

                btns[trackNum-1].className = "playPauseBtn isPlaying";

                controller.set( "trackPlaying", trackNum);
            }
        },

        selectSoundtrack: function(trackNum, controller)
        {
            var songs = document.getElementsByClassName("soundtrackListItem");
            var checks = document.getElementsByClassName("selectSongCheckBtn");

            if ( JagerBondsApp.NewBond.bondSoundtrackID !== trackNum ){
                //--OLD SONG
                songs[JagerBondsApp.NewBond.bondSoundtrackID-1].className = "soundtrackListItem";
                checks[JagerBondsApp.NewBond.bondSoundtrackID-1].className = "selectSongCheckBtn";
                //--NEW SONG
                songs[trackNum-1].className = "soundtrackListItem isSelected";
                checks[trackNum-1].className = "selectSongCheckBtn songCheckBtnOn";
                JagerBondsApp.NewBond.bondSoundtrackID = trackNum;
            }
        }
    }
});


// ----------------------------------
// ADD FRIENDS
// ----------------------------------
JagerBondsApp.FriendlistsController = Ember.ArrayController.extend({
    needs: ['application'],

    actions : {
        init: function() {
            var appController = this.get('controllers.application');
            appController.setProperties({
                showNav                : true
                ,rightBtn               : false
                ,leftBtn                : false
                ,title                  : "ADD FRIENDS"
                ,logoTitle              : false
                ,showBottomNav          : true
                ,leftBottomBtnLabel     : "BACK"
                ,rightBottomBtnLabel    : "LET'S GO"
                ,showFooter             : false

                // Change bottom nav button routes transition
                ,goTo_next              : function(){
                    //this.controllerFor("Friendlists").send("createTheBond");
                    this.transitionToRouteAnimated('done', {main: 'slideLeft'});
                }
                ,goTo_back              : function(){ this.transitionToRouteAnimated('create', {main: 'slideRight'}); }
            });
        }
    }
});

JagerBondsApp.FriendlistController = Ember.ArrayController.extend({

});



JagerBondsApp.FriendlistsIndexController = Ember.ArrayController.extend({
    actions: {
        init: function(){

        },

        updateFriendsSelection: function(){

            var _friendName = $('.friend').find('.name');
            $.each(_friendName, function(){
                var _parent = $(this).parent();
                var _name = $(this).text();

                $.each(JagerBondsApp.NewBond.friends, function(){

                    if(_name !== this.toString()){
                        console.log(_name);
                        console.log("String : " + this.toString());
                        console.log(_parent);

                        _parent.toggleClass('selected').find('.check-bubble').toggleClass('selected');
                    }
                });
            });
        }
    }
});

// ----------------------------------
// ENTER CODE
// ----------------------------------
JagerBondsApp.EnterCodeController = Ember.ObjectController.extend({
    needs: ['application'],

    actions : {
        init: function() {
            var appController = this.get('controllers.application');
            appController.setProperties({
                showNav                : true
                ,rightBtn               : false
                ,leftBtn                : true
                ,logoTitle              : true
                ,showFooter             : false
                ,goTo_back              : function(){ this.transitionToRouteAnimated('dash', {main: 'slideRight'}); }
            });
        },

        onCodeSucess: function(){
            this.transitionToRouteAnimated('dash', {main: 'slideRight'});
        }
    }

});


// ----------------------------------
// BOND DETAIL
// ----------------------------------
JagerBondsApp.BondDetailController = Ember.ObjectController.extend({
    //bondId: null,
    needs: ['application', 'bondDetailInvitees']

    ,totalPending: function(){
        var total = 0;
        var invites = this.get("model.invites");

        $.each(invites, function(){
            if(this.status === 0) total ++;
        });
        return total;
    }.property("model.invites")

    ,totalAccepted: function(){
        var total = 0;
        var invites = this.get("model.invites");

        $.each(invites, function(){
            if(this.status === 1) total ++;
        });
        return total;
    }.property("model.invites")

    ,totalRejected: function(){
        var total = 0;
        var invites = this.get("model.invites");

        $.each(invites, function(){
            if(this.status === 2) total ++;
        });
        return total;
    }.property("model.invites")

    ,totalLeft: function(){
        var total = 0;
        var invites = this.get("model.invites");

        $.each(invites, function(){
            if(this.status === 3) total ++;
        });
        return total;
    }.property("model.invites")

    ,actions: {
        init: function(model) {
            var appController = this.get('controllers.application');
            appController.setProperties({
                showNav                : true
                ,rightBtn               : false
                ,leftBtn                : true
                ,logoTitle              : false
                ,title                  : this.get("name")
                ,showBottomNav          : false
                ,showFooter             : false
                ,goTo_back              : function(){ this.transitionToRouteAnimated('dash', {main: 'slideRight'}); }
            });

//            window.addEventListener("paste",processEvent);
//            function processEvent(e) {
//                console.log("e: ", e);
//            }
        },

        copyCode: function(code){
            window.plugins.clipboard.copy(code);
        }
    }
});

JagerBondsApp.BondDetailInviteesController = Ember.ArrayController.extend({

});

// ----------------------------------
// DISCLAIMER
// ----------------------------------
JagerBondsApp.DisclaimerController = Ember.Controller.extend({
    needs: ['application'],

    actions : {
        init: function() {
            var appController = this.get('controllers.application');
            appController.setProperties({
                showNav                : true
                ,leftBtn                : true
                ,logoTitle              : true
                ,showFooter             : false
            });
        },

        gotIt: function(){
            this.transitionToRouteAnimated('create', {main: 'fade'});
            console.log("got it.");
        }
    }
});


// ----------------------------------
// BOND
// ----------------------------------
JagerBondsApp.BondController = Ember.Controller.extend({
    bonds: function(signIn){
        this.transitionToRouteAnimated('sign-in', {main: 'slideLeft'});
    }
});


// ----------------------------------
// SETTINGS
// ----------------------------------
JagerBondsApp.SettingsController = Ember.Controller.extend({
    instagramEnabled: false,
    facebookShareEnabled: false,
    emailsEnabled: false,
    phoneNotificationsEnabled: false,
    needs: ['application'],

    actions: {
        init: function() {
            var appController = this.get('controllers.application');
            appController.setProperties({
                showNav                 : true
                ,rightBtn               : false
                ,leftBtn                : true
                ,title                  : "SETTINGS"
                ,logoTitle              : false
                ,showBottomNav          : false
                ,showFooter             : false

                ,goTo_back              : function(){ this.transitionToRouteAnimated('dash', {main: 'slideRight'}); }
            });
        },

        logout: function(controller){
            /*
            this.transitionToRouteAnimated('age-gate', {main: 'slideRight'});
            fbLogout(controller, this); // Calls logout function from facebook.js
            this.set('controllers.application.isLoggedIn', false);
            */
        }

    }
});





// ----------------------------------
// DONE - CREATING BOND CONTROLLER
// ----------------------------------
JagerBondsApp.DoneController = Ember.Controller.extend({
    bondCreated: false,
    needs: ['application', 'bondDetail'],

    actions: {
        init: function(){
            //var bondDetailController = this.get('controllers.bondDetail');
            var appController = this.get('controllers.application');
            appController.setProperties({
                showNav                 : false
                ,showBottomNav          : false
                ,showFooter             : false
            });

            var _this = this;
            var fbUserId = window.localStorage.getItem("fbUserId");
            var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");

            $.ajax({
                url: "http://jagerbondsstaging.cloudapp.net/api/Bond/",
                type: "POST",
                async: false,
                data: {
                    name            : JagerBondsApp.NewBond.bondName,
                    durationInHours : JagerBondsApp.NewBond.bondDuration,
                    songId          : JagerBondsApp.NewBond.bondSoundtrackID,
                    ownerId         : fbUserId,
                    invites         : JagerBondsApp.NewBond.friends
                },
                beforeSend: function (request)
                {
                    request.setRequestHeader('Authorization', jagerbondsAuthToken);
                },
                success: function (data) {
                    //bondDetailController.set('bondId', data.id);

                    _this.set("bondCreated", true);
                    _this.set("bondId", data.id);
                }
            });
        }
    }
});