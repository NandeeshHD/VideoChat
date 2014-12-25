/**
 * Created by Sundresh H D on 24-10-2014.
 */
var updateStatus = function(){
    $.getJSON( '/status', function( data ) {
        console.log(data);

        //var content = '';

        //content += '<ul class="sidebar-menu online-user">';
        //content += '<li class="static">USERS</li>';

        $.each(data.online, function(){
            var content = '';
            //content += '<li><a id="'+this.username+'"' +' '+ 'href="/videochat/'+this.username+ '">';
            content += '<li><a id=online-"' + this.username + '">';
            content += '<span class="user-status success"></span>';
            content += '<img src="/images/user-img.jpg" class="ava-sidebar img-circle" alt="Avatar">';
            content += this.username;
            content += '<button class="btn btn-large btn-success" id="' + this.username + '">Call</button>';
            content += '<span class="small-caps">ONLINE</span>';
            content += '</a></li>';
            $('#online-user-list').append(content);
        });

        $.each(data.offline, function(){
            //content += '<li><a href="/'+this.videochaturl+'">';
            content += '<li><a id="'+this.username+'">';
            content += '<span class="user-status danger"></span>';
            content += '<img src="/images/user-img.jpg" class="ava-sidebar img-circle" alt="Avatar">';
            content += this.username;
            content += '<span class="small-caps">OFFLINE</span>';
            content += '</a></li>';
        });

        //content += '</ul>';
        //console.log(content);
        //$('#online-user-sidebar').html(content);
    });
};

updateStatus();
var interval = 1000 * 60 * 10;
setInterval(updateStatus, interval);