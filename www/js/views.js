// VIEWS
JagerBondsApp.AgeGateView = Ember.View.extend({
    templateName: 'age-gate',
    header: "JAGERBONDS",
    subtitle: "TO ACCESS THIS APP YOU MUST BE OF LEGAL DRINKING AGE. ENTER YOUR DATE OF BIRTH:"
});


JagerBondsApp.SignInView = Ember.View.extend({
    title: "JAGERBONDS",
    templateName: 'sign-in'
});


JagerBondsApp.DashView = Ember.View.extend({
    didInsertElement : function(controller) {

        JagerBondsApp.NewBond.set("friends", []);

        var viewportHeight = $(window).height();
        var navBarHeight = $('#nav-bar').outerHeight();

        $('.scrollpane').css({'height': viewportHeight - navBarHeight});
    }
});


JagerBondsApp.CreateView = Ember.View.extend({
    templateName: 'create',
    leftBtnLabel: 'BACK',
    rightBtnLabel: 'ADD FRIENDS',

    didInsertElement : function() {

        var viewportHeight = $(window).height();
        var navBarHeight = $('#nav-bar').outerHeight();
        var bottomNavHeight = $('.bottom-nav').outerHeight();
        $('.scrollpane').css({'height': viewportHeight - (navBarHeight + bottomNavHeight)});


        //------------------------------------------
        //----BOND NAME-----------------------------
        //------------------------------------------
        if (JagerBondsApp.NewBond.bondName !== '')
        {
            $('.nameField input').val(JagerBondsApp.NewBond.bondName);
            //$('.nameField input').attr("placeholder", JagerBondsApp.NewBond.bondName);//can't select at the end of the name here.
        }

        //------------------------------------------
        //----SLIDER--------------------------------
        //------------------------------------------
        function updateSliderDuration()
        {
            var durationtxt = $( ".slider" ).slider( "value" )/3;
            var num = Math.round(durationtxt);

            if (num < 1) { num = 1; }
            $( "#duration-txt" ).text(num + " HRS");
            JagerBondsApp.NewBond.bondDuration = num;
        }

        var duration = 18;
        if (JagerBondsApp.NewBond.bondDuration)
        {
            duration = JagerBondsApp.NewBond.bondDuration * 3;
            $('#duration-txt').text(JagerBondsApp.NewBond.bondDuration + " HRS");
        }

        $(function() {
            $( ".slider" ).slider({
              orientation: "horizontal",
              range: "min",
              max: 36,
              min:1,
              value: duration,
              slide: updateSliderDuration,
              change: updateSliderDuration
            });
        });

        //------------------------------------------
        //----SOUNDTRACK----------------------------
        //------------------------------------------
        var songs = document.getElementsByClassName("soundtrackListItem");
        var checks = document.getElementsByClassName("selectSongCheckBtn");
        var selectedSoundtrack = 1;
        if (JagerBondsApp.NewBond.bondSoundtrackID){
            selectedSoundtrack = JagerBondsApp.NewBond.bondSoundtrackID;
        }
        songs[selectedSoundtrack-1].className = "soundtrackListItem isSelected";
        checks[selectedSoundtrack-1].className = "selectSongCheckBtn songCheckBtnOn";
        JagerBondsApp.NewBond.bondSoundtrackID = selectedSoundtrack;
    }
});

JagerBondsApp.FriendlistsView = Ember.View.extend({
    templateName: 'Friendlists',
    title: "ADD FRIENDS",
    leftBtnLabel: "BACK",
    rightBtnLabel: "CREATE THE BOND",

    didInsertElement : function() {

        $('.fb-network-slider ul').roundabout({
            responsive: true,
            minScale: 1,
            maxScale: 1,
            enableDrag: true,
            tilt: 0,
            easing: "swing",
            triggerFocusEvents: true,
            minOpacity: 0,
            shape: 'square'
        });

        var viewportHeight = $(window).height();
        var navBarHeight = $('#nav-bar').outerHeight();
        var bottomNavHeight = $('.bottom-nav').outerHeight();
        $('.scrollpane').css({'height': viewportHeight - (navBarHeight + bottomNavHeight)});


        // LIVE SEARCH
        $('input[name="q"]').search('#data li', function(on) {
            on.all(function(results) {
                var size = results ? results.size() : 0
                $('#count').text(size + ' results');
            });

            on.reset(function() {
                $('#none').hide();
                $('#data li').show();
            });

            on.empty(function() {
                $('#none').show();
                $('#data li').hide();
            });

            on.results(function(results) {
                $('#none').hide();
                $('#data li').hide();
                results.show();
            });
        });
    }
});

JagerBondsApp.FriendlistsIndexView = Ember.View.extend({
    templateName: 'friendlists/index',

    didInsertElement : function() {

        var _friendItem = $('.friendlist').find('li');
        var _removeFriend = function(id){

            $.each(JagerBondsApp.NewBond.friends, function(){
                if(this.UserId == id){
                    JagerBondsApp.NewBond.friends.removeObject(this);
                }
            });
        };

        _friendItem.on('click', function(){
            var _id = $(this).attr("data-fb-id");
            $(this).toggleClass('selected').find('.check-bubble').toggleClass('selected');

            if(!$(this).hasClass('selected')){
                _removeFriend(_id);
            } else {
                JagerBondsApp.NewBond.friends.pushObject({BondId : 0, UserId : _id, invitedByUserId: window.localStorage.getItem("fbUserId"), status: 0});
            }
//            console.log(JagerBondsApp.NewBond.friends);
        });
    }
});

JagerBondsApp.FriendlistView = Ember.View.extend({
    templateName: 'friendlist',

    didInsertElement : function() {
        var _friendItem = $('.friendlist').find('li');
        var _friendName = $('.friend').find('.name');

        var _removeFriend = function(id){

            $.each(JagerBondsApp.NewBond.friends, function(){
                if(this.UserId == id){
                    JagerBondsApp.NewBond.friends.removeObject(this);
                }
            });
        };

        _friendItem.on('click', function(){
            var _id = $(this).attr("data-fb-id");
            $(this).toggleClass('selected').find('.check-bubble').toggleClass('selected');

            if(!$(this).hasClass('selected')){
                _removeFriend(_id);
            } else {
                JagerBondsApp.NewBond.friends.pushObject({BondId : 0, UserId : _id, invitedByUserId: window.localStorage.getItem("fbUserId"), status: 0});
            }
//            console.log(JagerBondsApp.NewBond.friends);
        });


        $.each(_friendName, function(){
            var _parent = $(this).parent();
            var _name = $(this).text();
            console.log(_name);

            $.each(JagerBondsApp.NewBond.friends, function(){

                if(_name == this.toString()){
                    console.log("String : " + this.toString());
                    _parent.toggleClass('selected').find('.check-bubble').toggleClass('selected');
                }
            });
        });
    }
});

JagerBondsApp.EnterCodeView = Ember.View.extend({
    templateName: 'enter-code',

    didInsertElement : function() {



    }
});

JagerBondsApp.BondDetailView = Ember.View.extend({
    templateName: 'bond-detail',

    didInsertElement : function() {

        var viewportHeight = $(window).height();
        var navBarHeight = $('#nav-bar').outerHeight();
        var bottomNavHeight = $('.bottom-nav').outerHeight();
        $('.scrollpane').css({'height': viewportHeight - (navBarHeight + bottomNavHeight)});

    }
});


JagerBondsApp.DoneView = Ember.View.extend({
    templateName: 'done',

    didInsertElement : function() {

    }
});



JagerBondsApp.DisclaimerView = Ember.View.extend({
    header1: "PROHIBITED CONTENT",
    body1: "Your video will be flagged if it contains: people underage consuming alcohol, overconsumption, hateful words or words that most people hate. No violence, with or without weapons. No nudity, tasteful or otherwise. And don’t even think about operating a vehicle other than your legs.",
    header2: "MODERATION",
    body2: "Any flagged content will be reviewed to make sure it meets our terms and conditions.",
    templateName: 'disclaimer'
});


JagerBondsApp.LogoutActionView = Ember.View.extend(Ember.ViewTargetActionSupport, {
    action: 'logout',
    click: function() {
        this.triggerAction(logout); // Sends the `save` action, along with the current context
        // to the current controller
    }
});


JagerBondsApp.BackActionView = Ember.View.extend(Ember.ViewTargetActionSupport, {
    action: 'goTo_back',
    click: function() {
        this.triggerAction(); // Sends the `save` action, along with the current context
        // to the current controller
    }
});


JagerBondsApp.CheckBubbleView = Ember.View.extend({
    classNameBindings: ['isSelected:selected:'],
    isSelected: false
});

JagerBondsApp.SettingsView = Ember.View.extend({
    templateName: 'settings',
 
    didInsertElement : function() {

        var viewportHeight = $(window).height();
        var navBarHeight = $('#nav-bar').outerHeight();
        var bottomNavHeight = $('.bottom-nav').outerHeight();
        $('.scrollpane').css({'height': viewportHeight - (navBarHeight + bottomNavHeight)});


        $(".setting").click( function() {
            if ($(this).hasClass('redirect'))
            {
                //link out to page.
            } else {
                if ($(this).children().hasClass('on'))
                {
                    $(this).find("h3").html("OFF");
                    $(this).children().removeClass('on');
                    $(this).children().children().removeClass('on');
                } else {
                    $(this).find("h3").html("ON");
                    $(this).children().addClass('on');
                    $(this).children().children().addClass('on');
                } 
            }
        });

        var a = document.createElement('div');
        $(a).addClass('redirect_bg')
            .appendTo($(".redirect "));        
    }
});