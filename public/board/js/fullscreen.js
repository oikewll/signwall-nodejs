//全屏
var cancelFullScreen = function (el) {
    var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(el);
    } else {
        IEFullScreen();
    }
}
var requestFullScreen = function (el) {
    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
        requestMethod.call(el);
    } else {
        IEFullScreen();
    }
    return false;
}
var IEFullScreen = function () {
    if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
var toggleFull = function () {
    //var elem = document.body; // Make the body go full screen.
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);
    if (isInFullScreen) {
        cancelFullScreen(document);
    } else {

        requestFullScreen(document.documentElement);
    }
    return false;
}

function fullscreen() {
    var fulltext = $("#imgfull").attr("alt");
    if (fulltext == "full") {
        $("#imgfull").attr("alt", "exitfull");
        $("#imgfull").attr("src", "/public/board/style/images/exitfullscreen.png");
        $("#imgfullfont").attr("src", "/public/board/style/images/exitfullscreenfont.png");
        toggleFull();
    }else {
        $("#imgfull").attr("alt", "full");
        $("#imgfull").attr("src", "/public/board/style/images/fullscreen.png");
        $("#imgfullfont").attr("src", "/public/board/style/images/fullscreenfont.png");
        toggleFull();
    }
}