window.Templates = {
    getTodoTemplate: function(task, limit, priority) {
        return (
            '<tr><td><p class="todo-task todo-click-task todo-uncheck">' + task + '</p></td>'
            + '<td><p class="todo-limit">' + limit + '</p></td>'
            + '<td><p class="class="priority">' + priority + '</p></td>'
            + '<td><input type="checkbox" class="todo-check"></td>'
            + '<td><button class="todo-delete">削除</button></td></tr>'
        );
    }
};
