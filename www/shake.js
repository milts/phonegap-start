var x = 0, y = 0,
    vx = 0, vy = 0,
    ax = 0, ay = 0;

var body = document.getElementById("mybody");
//var sphereA = document.getElementById("sphereA");
//var sphereB = document.getElementById("sphereA");
var maracas = document.getElementById("maracas");
var volume = 0;
var tilt = oldTilt = 0;

var colors = [ "#0836a7", "#cf142b", "#ffffff" ];
var currentColor = 0;

var imgA = document.getElementById("imgA");
var imgB = document.getElementById("imgB");

if (window.DeviceMotionEvent != undefined) {
    window.ondevicemotion = function (e) {
        ax = event.accelerationIncludingGravity.x * 5;
        ay = event.accelerationIncludingGravity.y * 5;
//        document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
//        document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
//        document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;

//        if (e.rotationRate) {
//            document.getElementById("rotationAlpha").innerHTML = e.rotationRate.alpha;
//            document.getElementById("rotationBeta").innerHTML = e.rotationRate.beta;
//            document.getElementById("rotationGamma").innerHTML = e.rotationRate.gamma;
//
//
//            document.getElementById("rotationAlpha").style.width = Math.abs(e.rotationRate.alpha * 100);
//            document.getElementById("rotationBeta").style.width = Math.abs(e.rotationRate.beta * 100);
//            document.getElementById("rotationGamma").style.width = Math.abs(e.rotationRate.gamma * 100);
//        }
    }

    var imageClicked = function() {

        if (myAudio.duration == 0 || maracas.paused) {
            maracas.play();
        } else {
            maracas.stop();
        }

        alert("click");
    }

//    imgA.addEventListener('click', imageClicked );
//    imgB.addEventListener('click', imageClicked );

    setInterval(function () {
        var landscapeOrientation = window.innerWidth / window.innerHeight > 1;
        if (landscapeOrientation) {
            vx = vx + ay;
            vy = vy + ax;
        } else {
            vy = vy - ay;
            vx = vx + ax;
        }
        vx = vx * 0.98;
        vy = vy * 0.98;
        y = parseInt(y + vy / 50);
        x = parseInt(x + vx / 50);


        if (volume > 0) {

            volume -= 0.05;

        }

        oldTilt = tilt;
        tilt = ax < 0 ? 0 : 1;

        if (oldTilt != tilt) {
            volume = 1;

            currentColor ++;
            currentColor = currentColor > 3 ? 0 : currentColor;
            body.style.backgroundColor = colors[ currentColor ];
        }

        maracas.volume = volume;


        if (tilt) {

//            body.style.backgroundColor = "#ff0";

            imgA.style.display = "block";
            imgB.style.display = "none";

        } else {

//            body.style.backgroundColor = "#0ff";

            imgA.style.display = "none";
            imgB.style.display = "block";
        }

    }, 25);

}