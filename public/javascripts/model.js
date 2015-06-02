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
            return JSON.parse(storage.getItem(SAVE_ID));
        };

        function setStrage(json) {
            console.log("test");
            storage.setItem(SAVE_ID, json);
        };

        return {
            saveTodo: function() {
                // TODO: サイズに応じて、どうやってセーブするかを選択できるようにする
                var json = JSON.stringify(todos);
                return setStrage(json);
            },

            getSize: function() {
                return todos.length;
            },

            getTodos: function() {
                return todos;
            },

            append: function(todo) {
                console.log(todos);
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
