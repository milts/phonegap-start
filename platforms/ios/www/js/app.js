JagerBondsApp = Ember.Application.create();

// Routes
JagerBondsApp.Router.map(function(){
    // Age gate/Sign in
    this.route("age-gate", { path: "/age-gate" });
    this.route("sign-in", { path: "/sign-in" });
    // Create Bonds
    this.route("start", { path: "/start" });
    this.route("create", { path: "/create" });
    this.route("add-friends", { path: "/add-friends" });
    // Dashboard
    this.route("dash", { path: "/dash" });
    this.route("details", { path: "/details" });
    // Bonds invite
    this.route("invite", { path: "/invite" });
    // Bond created
    this.route("done", { path: "/done" });
});


JagerBondsApp.ApplicationRoute = Ember.Route.extend({
    showSignIn: function(signIn){
        this.transitionToAnimated('sign-in', {main: 'slideLeft'});
    }
});


JagerBondsApp.IndexRoute = Ember.Route.extend({
    redirect: function() {
        // this redirects / to /dashboard
        this.transitionTo('age-gate');
    }
});

JagerBondsApp.AgeGateRoute = Ember.Route.extend({
    actions: {
        getFBSessionStatus: function(){
            if(getLoginStatus()){
                // this redirects / to /dashboard
                this.transitionToAnimated('dash', {main: 'slideLeft'});
            } else {
                //alert('not logged in');
                this.transitionToAnimated('sign-in', {main: 'slideLeft'});
            }
        }
    }
});

JagerBondsApp.SignInRoute = Ember.Route.extend({
    redirect: function() {
        if(getLoginStatus()){
            alert('logged in');
            // this redirects / to /dashboard
            this.transitionToAnimated('create', {main: 'slideLeft'});
        } else {
            //alert('not logged in');
            return false;
        }
    }
});

JagerBondsApp.DashRoute = Ember.Route.extend({
//    model: function(){
//        return $.getJSON('db/getJSON/');
//    }
});







// VIEWS
JagerBondsApp.AgeGateView = Ember.View.extend({
    templateName: 'age-gate',
    header: "JAGERBONDS",
    subtitle: "TO ACCESS THIS APP YOU MUST BE OF LEGAL DRINKING AGE. ENTER YOUR DATE OF BIRTH:"
});

JagerBondsApp.SignInView = Ember.View.extend({
    title: "JAGERBONDS",
    templateName: 'sign-in',

    didInsertElement : function() {
        $('button.fb-connect-btn').on('click', login );
    }
});


JagerBondsApp.CreateView = Ember.View.extend({
    templateName: 'create',
    header: "CREATE BOND",
    subtitle: "LOREM IPSUM CREATE BOND",

    didInsertElement : function() {
        $('button.logout').on('click', logout );

        me();

        // LIVE SEARCH
        $('input[name="q"]').search('#data div', function(on) {
            on.all(function(results) {
                var size = results ? results.size() : 0
                $('#count').text(size + ' results');
            });

            on.reset(function() {
                $('#none').hide();
                $('#data div').show();
            });

            on.empty(function() {
                $('#none').show();
                $('#data div').hide();
            });

            on.results(function(results) {
                $('#none').hide();
                $('#data div').hide();
                results.show();
            });
        });
    }
});



