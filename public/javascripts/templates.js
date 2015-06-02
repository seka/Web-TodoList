window.Templates = {
    getTodoTemplate: function(task, limit, priority) {
        return (
            '<tr><td><p class="js-todo-task js-todo-update todo-uncheck">' + task + '</p></td>'
            + '<td><p class="js-todo-limit">' + limit + '</p></td>'
            + '<td><p class="class="js-todo-priority">' + priority + '</p></td>'
            + '<td><input type="checkbox" class="js-todo-check"></td>'
            + '<td><button class="js-todo-delete">削除</button></td></tr>'
        );
    }
};
