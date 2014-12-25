/**
 * Created by Sundresh H D on 22-12-2014.
 */

var rtc = holla.createClient({debug:true});

/*
$(function() {
    server.on("presence", function(user){
        if (user.online) {
            console.log(user.name + " is online.");
        } else {
            console.log(user.name + " is offline.");
        }
    });

    holla.createFullStream(function(err, stream) {
        if (err) throw err;
        holla.pipe(stream, $(".me"));

        var content = '';
        content += '<div class="row">';
        content += '<div class="col-md-8">';
        content += '<video class="remote" autoplay="true"></video>';
        content += '<p class="text-right" class="btn btn-success" id="hangup">Hang Up!</p>';
        content += '</div>';
        content += '<div class="col-md-4">';
        content += '<video class="local rtc-pip" autoplay="true" muted="true"></video>';
        content += '</div>';
        content += '</div>';

        // accept inbound
        localUser = $("#username").get(0).innerHTML;
        server.register(localUser, function (worked) {
            server.on("call", function (call) {
                console.log("Inbound call", call);

                var remoteUser = call.user;
                //window.open('/videochat/' + call.user);

                $('#container').html(content);

                call.addStream(stream);
                call.answer();

                call.ready(function (stream) {
                    holla.pipe(stream, $(".remote"));
                });
                call.on("hangup", function () {
                    $(".remote").attr('src', '');
                });
                $("#hangup").click(function () {
                    call.end();
                });
            });
        });


        });
    });
*/

//place outbound
$(document).on('click', 'button', (function(){
    //alert(this.id);
    var content = '';
    content += '<div class="row">';
    content += '<div class="col-md-8">';
    content += '<video class="remote" autoplay="true"></video>';
    content += '<video class="local rtc-pip" autoplay="true" muted="true"></video>';
    //content += '<button class="btn btn-danger" id="hangup">Hang Up!</button>';
    content += '<p class="text-center"><a href="/home" class="btn btn-danger">Hang Up!</a></p>';
    //content += '</div>';
    //content += '<div class="col-md-4">';
    //content += '<video class="local rtc-pip" autoplay="true" muted="true"></video>';
    content += '</div>';
    content += '</div>';

    //alert(content);
    $('#container').html(content);
    remoteUser = this.id;
    localUser = $("#username").get(0).innerHTML;



    holla.createFullStream(function(err, stream) {
        if (err) throw err;
        holla.pipe(stream, $(".local"));

        // accept inbound
        rtc.register(localUser, function(worked) {
            rtc.on("call", function(call) {
                console.log("Inbound call", call);

                call.addStream(stream);
                call.answer();

                call.ready(function(stream) {
                    holla.pipe(stream, $(".remote"));
                });
                call.on("hangup", function() {
                    $(".remote").attr('src', '');
                });
                $("#hangup").click(function(){
                    call.end();
                });
            });

            //place outbound
            var toCall = remoteUser;
            var call = server.call(toCall);
            call.addStream(stream);
            call.ready(function(stream) {
                holla.pipe(stream, $(".remote"));
            });
            call.on("hangup", function() {
                $(".remote").attr('src', '');
            });
            $("#hangup").click(function(){
                call.end();
            });

        });
    });


/*    rtc.register(localUser, function(worked) {
        holla.createFullStream(function(err, stream) {
            if (err) throw err;

            var call = rtc.call(remoteUser);
            call.addStream(stream);
            call.ready(function(stream) {
                holla.pipe(stream, $(".remote"));
            });

            call.on("hangup", function() {
                $(".remote").attr('src', '');
            });
            $("#hangup").click(function(){
                call.end();

                call.on("answered", function() {
                console.log("Remote user answered the call");
            });

            console.log("Calling ", call.user);
        });
    });
});*/
}));
