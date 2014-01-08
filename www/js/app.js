JagerBondsApp = Ember.Application.create({
    LOG_TRANSITIONS: true
});

JagerBondsApp.User = Ember.Object.create({
    uid: null,
    accessToken: null,
    firstName: null,
    lastName: null,

    getUser: function(controller, appController, bondsController){
        var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");
        var _this = this;

        $.ajax({
            url: "http://jagerbondsstaging.cloudapp.net/api/User/",
            type: "GET",
            async: false,
            beforeSend: function (request){
                request.setRequestHeader('Authorization', jagerbondsAuthToken);
            },
            statusCode: {
                404: function() {
                    _this.createUser(controller, appController, bondsController);
                }
            },
            success: function (data) {
                var finishedBond = 0;

                // check if any bonds exist either self created or invited to
                if(data.bonds.length || data.invites.length){
                    controller.set('hasBonds', true);
                    controller.set('hasInvites', true);
                }

                // check bond duration status
                $.each(data.bonds, function(){
                    if(this.status === 1){ finishedBond ++ }
                });

                // if there are completed bonds,
                // set hasFinishedBonds property in controller to true
                if(finishedBond > 0){
                    controller.set('hasFinishedBonds', true);
                }

                controller.send('init');
                appController.set("rightBtn", true);
                bondsController.set('content', data);
            }
        });
    },
    createUser: function(controller, appController, bondsController){
        var _this = this;

        $.ajax({
            type: "POST",
            url: "http://jagerbondsstaging.cloudapp.net/api/User",
            data:  { id: _this.uid, facebookToken: _this.accessToken },
            async: false
        }).done(function(data) {
            // Store our returned UserID and Authorization Token into Local Storage
            window.localStorage.setItem("fbUserId", _this.uid);
            window.localStorage.setItem("jagerbondsAuthToken", 'Basic ' + data.facebookToken);

            if(arguments.length === 1){
                // If there's only one argument then call joinBond function sing the single argument
                this.joinBond(arguments[0]);
            } else {
                _this.getUser(controller, appController, bondsController);
            }
        });
    },
    joinBond: function(_code){
        var _this = this;
        var jagerbondsAuthToken = window.localStorage.getItem("jagerbondsAuthToken");
        var userID = window.localStorage.getItem("fbUserId");

        $.ajax({
            type: "POST",
            url: "http://jagerbondsstaging.cloudapp.net/api/Invite?code="+_code,
            data:  { userList: [_this.uid] },
            beforeSend: function (request){
                request.setRequestHeader('Authorization', jagerbondsAuthToken);
            },
            async: false,
            statusCode: {
                403: function() {
                    // Call createUser function with one argument. Type of argument does not matter we just need something.
                    _this.createUser(1);
                }
            },
            success: function(){
                //controller.send('onCodeSucess');
            }
        });
    }
});

JagerBondsApp.NewBond = Ember.Object.create({
	bondName: '',
	bondDuration: 6,
	bondSoundtrackID: 0,
	friends: []
});

JagerBondsApp.ViewBondDetail = Ember.Object.extend({
	bondId: null,
	isInProgress: true,
	bondName: null,
	endTime: null,
	bondCode: null,
	bondOwnerId: null,
	status: null
});

Ember.Handlebars.helper('timestamp', function(value, options) {
    var parsed_date = moment(value).calendar();
    return parsed_date;
});