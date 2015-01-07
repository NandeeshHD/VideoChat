/**
 * Created by Sundresh H D on 07-01-2015.
 */
$("#todo-form").submit(function (event) {
    //alert('event');
    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
    var $form = $(this),
        taskname = $form.find('input[name="taskname"]').val(),
        comment = $form.find('textarea[name="comment"]').val(),
        url = $form.attr('action');

    /* Send the data using post */
    var posting = $.post(url, {
        taskname: taskname,
        comment: comment
    });

    /* Put the results in a div */
    posting.done(function (data) {
        //var content = $(data).find('#comments');
        //$("#result").empty().append(content);
        //alert(data);

        var content = '';
        content += '<li class="static">To-Do Tasks</li>';
        $.each(data.todo, function() {
            content += '<li><a data-toggle="tooltip" title="Task to be done!" data-placement="left">';
            content += '<i class="fa fa-clock-o icon-task-sidebar progress"></i>';
            content += this.taskname;
            content += '<span class="small-caps">' + this.comment + '</span>';
            content += '</a></li>';
        });

        $('#task-list').html(content);

    });
});
