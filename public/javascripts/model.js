window.TodoModel = (function(storage) {

    var instance;

    function init() {
        /* todosには以下のフォーマットのオブジェクトが格納される
         * todos = [
         *      {
         *          task: String
         *          limit: Date
         *          priority: enum('low', 'middle', 'high')
         *          check: Bool
         *      },
                ...
         * ]
         */
        var SAVE_ID = "MyTodoApplication";
        var todos   = getStrage() || [];
        var size    = todos.length;

        function getStrage() {
            return storage.getItem(SAVE_ID);
        };

        function setStrage() {
            storage.setItem(SAVE_ID, todos);
        };

        return {
            getSize: function() {
                return todos.length;
            },

            getTodos: function() {
                return todos;
            },

            append: function(todo) {
                todos.push(todo);
                size++;
            },

            update: function(index, newTodo) {
                todos[index] = newTodo;
            },

            remove: function(index) {
                if (size < index) return false;
                todos.splice(index, 1);
                size--;
            },

            active: function(index) {
                if (!todos[index]) return;
                todos[index].check = false;
            },

            finish: function(index) {
                if (!todos[index]) return;
                todos[index].check = true;
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})(sessionStorage);
