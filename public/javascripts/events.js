window.TodoEvents = (function($) {
    var $task;
    var $limit;
    var $priority;

    var _createTemplate = window.Templates.getTodoTemplate;

    function TodoEvents($task, $limit, $priority) {
        this.$task     = $task;
        this.$limit    = $limit;
        this.$priority = $priority;
    }

    TodoEvents.prototype.registTodo = function() {
        // TODO:入力値のバリデーションを行う必要有り
        var templates = _createTemplate(this.$task.val(), this.$limit.val(), this.$priority.val());
        $('#js-todo-contents').append(templates);
    };

    TodoEvents.prototype.removeTodo = function() {
        var $tr = $(this).closest('tr');
        var res = $tr.index();
        $tr.remove();
        return res;
    };

    TodoEvents.prototype.changeTodoState = function() {
        var $tr   = $(this).closest('tr');
        var $task = $tr.find('.js-todo-task');
        $task.toggleClass('todo-check todo-uncheck');
        return { "index": $tr.index(), "row": $tr };
    };

    TodoEvents.prototype.updateTodoTask = function(promise) {
        var $p     = $(this);
        var $input = $('<input>')
                        .attr('type', 'text')
                        .val($p.text());
        var $tr    = $p.closest('tr');

        // エンターキーが押された場合とフォーカスが外れた場合は編集終了
        $input.keydown(customKeyDownEvent());
        $input.blur(customBlurEvent($p, $input, $tr, promise));

        // pタグとinputタグを交換する
        $p.replaceWith($input);
        $input.focus();
    };

    var customKeyDownEvent = function() {
        var ENTER_KEY = 13;
        return function(e) {
            if (e.keyCode !== ENTER_KEY) return;
            $(this).blur();
        }
    };

    var customBlurEvent = function($p, $input, $tr, promise) {
        return function(e) {
            swapTagWithValue($p, $input)
            promise.resolve({ "index": $tr.index(), "row": $tr });
        };
    };

    // TODO:utilクラスに追い出しても良いかも？
    var swapTagWithValue = function($el1, $el2) {
        $el1.text($el2.val());
        $el2.replaceWith($el1);
    };

    return TodoEvents;
})(jQuery);
