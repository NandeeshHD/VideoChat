/**
 * Created by Sundresh H D on 23-12-2014.
 */

var rtc = holla.createClient({debug:true});

localUser = $("#username").get(0).innerHTML;
rtc.register(localUser, function(worked) {
    rtc.on("call", function(call) {
        console.log("Inbound call from ", call.user);

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


        holla.createFullStream(function(err, stream) {

            call.addStream(stream);
            call.answer();
            holla.pipe(stream, $(".local"));

            call.ready(function(stream) {
                holla.pipe(stream, $(".remote"));
            });

        });

    });
});