;(function(window, $) {
    $(function (){
        var $task     = $('#input-task');
        var $limit    = $('#input-limit');
        var $priority = $('#input-priority');

        var todoEvents = new window.TodoEvents($task, $limit, $priority);
        var todoModel  = new window.TodoModel.getInstance();

        $('#todo-regist').on('click', function(e) {
            todoEvents.registTodo();
            var dto = makeDto($task.val(), $limit.val(), $priority.val(), false);
            todoModel.append(dto);
        });

        $('#todo-contents').on('click', '.todo-delete', function(e) {
            var removeEvent = todoEvents.removeTodo.bind(this);
            var index = removeEvent();

            if (index < 0) return;
            todoModel.remove(index);
        });

        $('#todo-contents').on('change', '.todo-check', function(e) {
            var updateEvent = todoEvents.changeTodoState.bind(this);
            var indexWithRow = updateEvent();

            if (indexWithRow.index < 0) return;
            var created = createTodoDto.bind(this);
            var dto = createTodoDto(indexWithRow.row);
            todoModel.update(indexWithRow.index, dto);
        });

        $('#todo-contents').on('click', '.todo-click-task', function(e) {
            var dfd = new $.Deferred();

            // 内部でinputタグとpタグを交換しているので
            // 先にmodelの部分を処理するしないとclosestが使えない
            var updateEvent = todoEvents.updateTodoTask.bind(this);
            updateEvent(dfd);

            // ユーザの入力後に更新処理を行うためPromiseを用いる
            dfd.done($.proxy(function(indexWithRow) {
                if (indexWithRow.index < 0) return;
                var dto = createTodoDto(indexWithRow.row);
                todoModel.update(indexWithRow.index, dto);
            }, this));
        });
    });

    function createTodoDto($row) {
        var limit    = $row.find('.todo-limit').text();
        var task     = $row.find('.todo-task').text();
        var priority = $row.find('.todo-priority').text();
        var state    = $row.find('.todo-check').prop('checked');
        return makeDto(task, limit, priority, state);
    }

})(window, jQuery);
