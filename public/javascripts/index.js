;(function(window, $) {
    $(function (){
        var $task     = $('#js-input-task');
        var $limit    = $('#js-input-limit');
        var $priority = $('#js-input-priority');

        var todoEvents = new window.TodoEvents($task, $limit, $priority);
        var todoModel  = new window.TodoModel.getInstance();

        // todoModelのinstance作成時にローカルストレージを探索しているので、
        // サイズ
        if (todoModel.getSize() > 0){
            var _createTemplate = window.Templates.getTodoTemplate;
            var todoDto = "";
            var created = "";
            todoModel.getTodos().forEach(function(v, i) {
                created += _createTemplate(v.task, v.limit, v.priority, v.check);
            });
            $('#js-todo-contents').append(created);
        }

        $('#js-todo-regist').on('click', function(e) {
            todoEvents.registTodo();
            var dto = makeDto($task.val(), $limit.val(), $priority.val(), false);
            todoModel.append(dto);
            todoModel.saveTodo()
        });

        $('#js-todo-contents').on('click', '.js-todo-delete', function(e) {
            var removeEvent = todoEvents.removeTodo.bind(this);
            var index = removeEvent();

            if (index < 0) return;
            todoModel.remove(index);
            todoModel.saveTodo();
        });

        $('#js-todo-contents').on('change', '.js-todo-check', function(e) {
            var updateEvent = todoEvents.changeTodoState.bind(this);
            var indexWithRow = updateEvent();

            if (indexWithRow.index < 0) return;
            var created = createTodoDto.bind(this);
            var dto = createTodoDto(indexWithRow.row);
            todoModel.update(indexWithRow.index, dto);
            todoModel.saveTodo()
        });

        $('#js-todo-contents').on('click', '.js-todo-update', function(e) {
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
                todoModel.saveTodo()
            }, this));
        });
    });

    function createTodoDto($row) {
        var limit    = $row.find('.js-todo-limit').text();
        var task     = $row.find('.js-todo-task').text();
        var priority = $row.find('.js-todo-priority').text();
        var state    = $row.find('.js-todo-check').prop('checked');
        return makeDto(task, limit, priority, state);
    }

    function makeDto(task, limit, priority, check) {
        return {
            task       : task     || ""
            , limit    : limit    || ""
            , priority : priority || 'low'
            , check    : check    || false
        };
    }

})(window, jQuery);
