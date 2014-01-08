// Routes
JagerBondsApp.Router.map(function(){
    // Age gate/Sign in
    this.resource("age-gate", { path: "/" });
    // Dashboard
    this.resource("dash", { path: "/dash" });

    // Create
    this.route("create", { path: "/create" });
    // Add Friends

    this.resource("friendlists", function(){
        this.resource("friendlist", { path: ":id" });
        this.resource("friendlists.index", { path: "/all" });
    });

    //Enter Code
    this.route("enter-code", { path: "/enter-code" });
    //Bond Detail
    this.route("bond-detail", { path: "/bond-detail/:bond_id" });
    // Disclaimer
    this.route("disclaimer", { path: "/disclaimer" });
    // Bond details
//    this.route("details", { path: "/details" });
    // Bonds invite
    this.route("invite", { path: "/invite" });
    // Settings
    this.route("settings", { path: "/settings" });
    // Bond created
    this.route("done", { path: "/done" });
});


// APPLICATION
JagerBondsApp.ApplicationRoute = Ember.Route.extend({

});


// DASH
JagerBondsApp.DashRoute = Ember.Route.extend({
    model: function() {
        return [];
    },

    setupController: function (controller) {
        var _this = this;
        var appController = _this.controllerFor('application');

        getLoginStatus(controller, appController, function(){

            var fbUserId = window.localStorage.getItem("fbUserId");
            var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");
            var bondsController = _this.controllerFor('bonds');

            if(!jagerbondsAuthToken){
                JagerBondsApp.User.createUser(controller, appController, bondsController, fbUserId, jagerbondsAuthToken);
            } else {
                JagerBondsApp.User.getUser(controller, appController, bondsController, fbUserId, jagerbondsAuthToken);
            }
        });

        controller.send('init');
    }
});


// FRIENDLISTS
JagerBondsApp.FriendlistsRoute = Ember.Route.extend({
    model: function() {
        var _fbAuthToken    = getFbToken();
        var _api            = "/me/friendlists";
        var _fields         = "name, list_type, members";
        var _url            = "https://graph.facebook.com" + _api + "?access_token=" + _fbAuthToken + "&fields=" + _fields;

        return $.getJSON(_url).then(function(response){
            //console.log(data);
            return response.data;
        });
    },

    setupController: function (controller, model) {
        controller.set('content', model);
        controller.send('init');

        this.controllerFor('Friendlist').set('model', model);
    }
});


// FRIENDLIST INDEX
JagerBondsApp.FriendlistsIndexRoute = Ember.Route.extend({
    model: function() {
        var _fbAuthToken    = getFbToken();
        var _api            = "/me/friends";
        var _fields         = "id, name, picture";
        var _url            = "https://graph.facebook.com" + _api + "?access_token=" + _fbAuthToken + "&fields=" + _fields;

        return $.getJSON(_url).then(function(response){
            //console.log(data);
            return response.data;
        });
    },

    setupController: function (controller, model) {
        controller.set('content', model.sort(sortMethod));
    }
});



// FRIENDLIST
JagerBondsApp.FriendlistRoute = Ember.Route.extend({
    model: function(params){
        return JagerBondsApp.FriendlistRoute.find(params.friendlist_id);
    },

    setupController: function (controller, model) {
        //console.log(model.members.data);
        controller.set('content', model.members.data.sort(sortMethod));
    }
});


// ENTER CODE
JagerBondsApp.EnterCodeRoute = Ember.Route.extend({
    model: function(params){
        return [];
    },

    setupController: function (controller, model) {
        controller.send('init');
    },

    actions: {
        enterCode: function(controller){
            var _code = $("#enter-code input").val();
            JagerBondsApp.User.joinBond(controller, _code);
        }
    }



    /*,

    actions: {
        enterCode: function(controller){
            var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");
            var fbUserId = window.localStorage.getItem("fbUserId");
            var _code = $("#enter-code input").val();

            $.ajax({
                type: "POST",
                url: "http://jagerbondsstaging.cloudapp.net/api/Invite?code="+_code,
                data: { userList: [fbUserId] },
                async: false,
                beforeSend: function (request)
                {
                    request.setRequestHeader('Authorization', jagerbondsAuthToken);
                },
                success: function (data) {
                    controller.send('onCodeSucess');
                },
                error: function(data){
                    $(".errorIcon").show();
                    $(".errorMessage").show();
                }
            }).done(function(data) {

            });
        }
    }
    */
});



// BOND DETAIL
JagerBondsApp.BondDetailRoute = Ember.Route.extend({
    model: function(params){
        return params;
    },

    setupController: function (controller, model) {
        var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");

        $.ajax({
            type: "GET",
            url: "http://jagerbondsstaging.cloudapp.net/api/Bond/" + model.bond_id,
            async: false,
            beforeSend: function (request)
            {
                request.setRequestHeader('Authorization', jagerbondsAuthToken);
            }
        }).done(function(data) {
            //console.log("---USER DATA: ", data);
            controller.set('content', data);
        });
        controller.send('init');
    }
});




// CREATE BOND
JagerBondsApp.CreateRoute = Ember.Route.extend({
    model: function() {
        return [];
    },

    setupController: function (controller) {
        $.ajax({
            type: "GET",
            url: "http://jagerbondsstaging.cloudapp.net/api/Song",
            async: false
        }).done(function(data) {
            controller.set('content', data);
        });

        controller.send('init');
    }
});




// CREATE BOND
JagerBondsApp.DoneRoute = Ember.Route.extend({
    model: function(params) {
        return [];
    },

    setupController: function (controller) {
        controller.send('init');
    },

    actions: {
        goTo_dash: function(){
            this.transitionToAnimated("dash", {main: "slideRight"});
        },
        goTo_detail: function(bond_id){
            this.transitionToAnimated("bond-detail", {main: "slideLeft"}, bond_id);
        }
    }
});





// SETTINGS
JagerBondsApp.SettingsRoute = Ember.Route.extend({
    model: function() {
        return [];
    },

    setupController: function (controller) {
        //var fbUserId = window.localStorage.getItem("fbUserId");
        var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");

        $.ajax({
            url: "http://jagerbondsstaging.cloudapp.net/api/User",
            type: "GET",
            async: false,
            beforeSend: function (request)
            {
                request.setRequestHeader('Authorization', jagerbondsAuthToken);
            },
            success: function (data) {
                //console.log("---USER DATA: ", data);
                controller.set("instagramEnabled", data.instagramEnabled);
                controller.set("enableFacebookNotifications", data.enableFacebookNotifications);
                var deviceCount = data.devices.length;
                if (deviceCount) {
                    controller.set("phoneNotificationsEnabled", true);
                } else {
                    controller.set("phoneNotificationsEnabled", false);
                }
            }
        });
        controller.send('init');
    }
});



// DISCLAIMER
JagerBondsApp.DisclaimerRoute = Ember.Route.extend({
    setupController: function (controller) {
        controller.send('init');
    }
});
