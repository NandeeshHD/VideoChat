/**
 * Created by Sundresh H D on 11-11-2014.
 */
/* attach a submit handler to the form */
$("#comment-form").submit(function (event) {
    //alert('event');
    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
    var $form = $(this),
        name = $form.find('input[name="name"]').val(),
        comment = $form.find('textarea[name="comment"]').val(),
        url = $form.attr('action');

    /* Send the data using post */
    var posting = $.post(url, {
        name: name,
        comment: comment
    });

    /* Put the results in a div */
    posting.done(function (data) {
        //var content = $(data).find('#comments');
        //$("#result").empty().append(content);
        //alert(data);
        var content = '';
        content += '<h4 class="small-heading more-margin-bottom">No. of comments: ' + data.comments.length + '</h4>';
        content += '<ul class="media-list media-sm media-dotted">';
        $.each(data.comments, function() {
            content += '<li class="media">';
            content += '<div class="media-body">';
            content += '<h4 class="media-heading">' + this.name + '</h4>';
            content += this.comment;
            content += '</div>';
            content += '</li>';
        });
        content += '</ul>';

        $('#comments').html(content);
    });
});