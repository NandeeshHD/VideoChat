/**
 * Created by Sundresh H D on 24-12-2014.
 */
var selfEasyrtcid = "";
var haveSelfVideo = false;

function disable(domId) {
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
        document.getElementById(domId).disabled = "";
}


function connect() {
    easyrtc.enableAudio(true);
    easyrtc.enableVideo(true);
    easyrtc.enableVideoReceive(true);
    easyrtc.enableAudioReceive(true);
    var userName = document.getElementById('username').innerHTML;
    easyrtc.setUsername(userName);
    easyrtc.setRoomOccupantListener(convertListToButtons);
    easyrtc.connect("VideoChat", loginSuccess, loginFailure);
}


function hangup() {
    easyrtc.hangupAll();
    disable("hangupButton");
    window.location.replace("/home");
}


function clearConnectList() {
    var otherClientDiv = document.getElementById("online-user-list");
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


function convertListToButtons (roomName, occupants, isPrimary) {
    clearConnectList();

    for(var easyrtcid in occupants) {
        var content = '';
        var name = easyrtc.idToName(easyrtcid);

        content += '<li><a id=online-"' + name + '">';
        content += '<span class="user-status success"></span>';
        content += '<img src="/images/user-img.jpg" class="ava-sidebar img-circle" alt="Avatar">';
        content += name;
        content += '<div id="' + easyrtcid + '"></div>';    // <button class="btn btn-large btn-success" id="' + name + '">Call</button></div>';
        //content += '<span class="small-caps">ONLINE</span>';
        content += '</a></li>';
        $('#online-user-list').append(content);

        var otherClientDiv = document.getElementById(easyrtcid);
        var button = document.createElement("button");
        button.onclick = function(easyrtcid) {
        return function() {
        performCall(easyrtcid);
        };
        }(easyrtcid);
        var label = document.createTextNode("Call");
        var att = document.createAttribute("class");
        att.value = "btn-small btn-success";
        button.setAttributeNode(att);
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


function setUpMirror() {
    if( !haveSelfVideo) {
        var selfVideo = document.getElementById("selfVideo");
        easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
        selfVideo.muted = true;
        haveSelfVideo = true;
    }
}


function performCall(otherEasyrtcid) {
    easyrtc.hangupAll();
    loadInnerHtml();
    document.getElementById("acceptCallBox").style.display = "none";
    document.getElementById("callControls").style.display = "none";
    document.getElementById("connectControls").style.display = "block";

    var acceptedCB = function(accepted, easyrtcid) {
        if( !accepted ) {
            easyrtc.showError("CALL-REJECTEd", "Sorry, your call to " + easyrtc.idToName(easyrtcid) + " was rejected");
            enable("online-user-sidebar");
        }
    };

    var successCB = function() {
        setUpMirror();
        enable("hangupButton");
    };
    var failureCB = function() {
        enable("online-user-sidebar");
    };
    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
    enable("hangupButton");
}


function loginSuccess(easyrtcid) {
    //disable("connectButton");
    //  enable("disconnectButton");
    enable("online-user-sidebar");
    selfEasyrtcid = easyrtcid;
    var name = easyrtc.idToName(easyrtcid);
    console.log("I am " + name);
    //document.getElementById("iam").innerHTML = "I am " + name; //easyrtc.cleanId(easyrtcid);
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    easyrtc.disconnect();
    enable("connectButton");
//  disable("disconnectButton");
    clearConnectList();
    easyrtc.setVideoObjectSrc(document.getElementById("selfVideo"), "");
}


easyrtc.setStreamAcceptor( function(easyrtcid, stream) {
    setUpMirror();
    var video = document.getElementById("callerVideo");
    easyrtc.setVideoObjectSrc(video,stream);
    enable("hangupButton");
});


easyrtc.setOnStreamClosed( function (easyrtcid) {
    easyrtc.setVideoObjectSrc(document.getElementById("callerVideo"), "");
    //disable("hangupButton");
});


var callerPending = null;

easyrtc.setCallCancelled( function(easyrtcid){
    if( easyrtcid === callerPending) {
        document.getElementById("acceptCallBox").style.display = "none";
        document.getElementById("callControls").style.display = "none";
        document.getElementById("connectControls").style.display = "none";
        callerPending = false;
    }
});


function loadInnerHtml(){
    var content = '';
    content += '<h1 class="page-heading">Video Call <small>In Progress...</small></h1>';
    content += '<div class="row">';
    content += '<div class="col-md-12">';
    content += '<div id="demoContainer">';
    content += '<div id="videos">';
    content += '<video autoplay="autoplay" id="callerVideo" ></video>';
    content += '<video autoplay="autoplay" id="selfVideo"  class="easyrtcMirror" muted="muted" volume="0" style="width: 320px;"></video>';
    content += '</div>';
    content += '<div id="acceptCallBox"> <!-- Should be initially hidden using CSS -->';
    content += '<div id="acceptCallLabel">';
    content += '</div>';
    content += '</div>';
    content += '<div id="callControls">';
    content += '<button id="callAcceptButton" class="btn btn-large btn-success">Accept</button> <button id="callRejectButton" class="btn btn-large btn-danger">Reject</button>';
    content += '</div>';
    content += '<div id="connectControls">';
    content += '<button id="hangupButton" class="btn btn-large btn-warning" disabled="disabled" onclick="hangup()">Hangup</button>';
    content += '</div>';
    content += '</div>';
    content += '</div>';
    content += '</div>';

    $('#container').html(content);
}


easyrtc.setAcceptChecker(function(easyrtcid, callback) {
    loadInnerHtml();
    document.getElementById("acceptCallBox").style.display = "block";
    document.getElementById("callControls").style.display = "block";
    document.getElementById("connectControls").style.display = "none";
    callerPending = easyrtcid;

    var acceptTheCall = function(wasAccepted) {
        document.getElementById("acceptCallBox").style.display = "none";
        document.getElementById("callControls").style.display = "none";
        document.getElementById("connectControls").style.display = "block";
        if( wasAccepted && easyrtc.getConnectionCount() > 0 ) {
            //loadInnerHtml();
            easyrtc.hangupAll();
        }
        //loadInnerHtml();
        callback(wasAccepted);
        callerPending = null;
    };


    if( easyrtc.getConnectionCount() > 0 ) {
        document.getElementById("acceptCallLabel").innerHTML = "Drop current call and accept new from " + easyrtc.idToName(easyrtcid) + " ?";
    }
    else {
        document.getElementById("acceptCallLabel").innerHTML = "Accept incoming call from " + easyrtc.idToName(easyrtcid) + " ?";
    }

    document.getElementById("callAcceptButton").onclick = function() {
        acceptTheCall(true);
    };
    document.getElementById("callRejectButton").onclick =function() {
        acceptTheCall(false);
    };

} );