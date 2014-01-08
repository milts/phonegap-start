FB.init({
    appId: "260699214082942",
    nativeInterface: CDV.FB,
    useCachedDialogs: false,

    status      : true, // Check Facebook Login status
    cookie      : false, // enable cookies to allow the server to access the session
    xfbml       : true, // Look for social plugins on the page
    oauth       : true // enables OAuth 2.0
});

// These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory
//if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
//if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
//if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

function getLoginStatus(controller, appController, callback) {
    FB.getLoginStatus(function(response) {
        // check if user is logged into facebook and has a valid
        // JagerBond auth token from JagerBond REST service.
        if (response.status == 'connected') {
            controller.set("loggedIn", true);
            JagerBondsApp.User.set("uid", response.authResponse.userID);
            JagerBondsApp.User.set("accessToken", response.authResponse.accessToken);
            appController.set("rightBtn", true);

            callback();
        } else {
            // login if not logged in
            appController.set("rightBtn", false);
            appController.set("showFooter", true);
        }
    });
}

function getFbToken() {
    var accessToken = null;
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            //alert('logged in');
            accessToken = response.authResponse.accessToken;
        } else {
            // login if not logged in
            //login();
        }
    });
    return accessToken;
}



function login(controller, appController, bondsController){
    console.log(1);

    FB.login(
        function(response) {
            if (response.authResponse) {
                console.log(2);

                JagerBondsApp.User.set("uid", response.authResponse.userID);
                JagerBondsApp.User.set("accessToken", response.authResponse.accessToken);
                // Setup Local Storage key
//                var fbUserId = window.localStorage.key(0);
//                var jagerbondsAuthToken = window.localStorage.key(1);

                controller.set('loggedIn', true);
                JagerBondsApp.User.getUser(controller, appController, bondsController);
            } else {
                alert('Login Fail');
            }
        },{ scope: "email" });
}



function fbLogout(controller, $this) {
    FB.logout(function(response) {
        alert('logged out');
        //window.localStorage.setItem("jagerbondsAuthToken", "null");
        //window.localStorage.clear();
        controller.set('loggedIn', false);
        alert('logged out 2');
    });
}

function sortMethod(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

var friendlists = null;
function setFriendlists(friends){
    //alert(friends);
    //console.log('In Function : ' + friends);
    friendlists = friends;
}


function getFriendlists() {
    //var data = document.getElementById('data');
    //data.innerHTML = '';
    //var friends = null;


//    FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
//        if (response.error) {
//            alert(JSON.stringify(response.error));
//        } else {
//            //var data = document.getElementById('data');
//
//            setFriendlists(response.data.sort(sortMethod));
//            return false;
//            fdata=response.data;
//            console.log("fdata: "+fdata);

            // append friends profile picture and name to DOM
//            response.data.forEach(function(item) {
//                var d = document.createElement('div');
//
//                d.innerHTML = "<span><img src='" + "https://graph.facebook.com/" + item.id + "/picture?type=small'/></span>" + "<p class='name'>" + item.name + "</p>";
//                data.appendChild(d);
//
//                // push name to array
//                friendNames.push(item.name);
//            });
       // }

//        for (var k = 0; k < friends.length && k < 200; k++) {
//            var friend = friends[k];
//            var index = 1;
//
//            friendIDs[k] = friend.id;
//            //friendsInfo[k] = friend;
//        }
   // });
}










//FB.Event.subscribe('auth.login', function(response) {
//    //alert('auth.login event');
//});
//
//FB.Event.subscribe('auth.logout', function(response) {
//    //alert('auth.logout event');
//});
//
//FB.Event.subscribe('auth.sessionChange', function(response) {
//    //alert('auth.sessionChange event');
//});
//
//FB.Event.subscribe('auth.statusChange', function(response) {
//    //alert('auth.statusChange event');
//});

/*function getSession() {
 alert("session: " + JSON.stringify(FB.getSession()));
 }
 */

function facebookWallPost() {
    console.log('Debug 1');
    var params = {
        method: 'feed',
        name: 'Facebook Dialogs',
        link: 'https://developers.facebook.com/docs/reference/dialogs/',
        picture: 'http://fbrell.com/f8.jpg',
        caption: 'Reference Documentation',
        description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
    };
    console.log(params);
    FB.ui(params, function(obj) { console.log(obj);});
}

function publishStoryFriend() {
    randNum = Math.floor ( Math.random() * friendIDs.length );

    var friendID = friendIDs[randNum];
    if (friendID == undefined){
        alert('please click the me button to get a list of friends first');
    }else{
        console.log("friend id: " + friendID );
        console.log('Opening a dialog for friendID: ', friendID);
        var params = {
            method: 'feed',
            to: friendID.toString(),
            name: 'Facebook Dialogs',
            link: 'https://developers.facebook.com/docs/reference/dialogs/',
            picture: 'http://fbrell.com/f8.jpg',
            caption: 'Reference Documentation',
            description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
        };
        FB.ui(params, function(obj) { console.log(obj);});
    }
}