/**
 * 本アプリにおけるモデル処理を担当する
 * TODOのリストの管理を行っている他、ローカルストレージのアクセスも担当している
 */

window.TodoModel = (function(storage) {
    /**
     * jsにおけるシングルトンパターンを実現するための方法の１つ
     */
    var instance;

    /**
     * init関数内でreturnされる以外のオブジェクトは
     * プライベートな関数・変数となっている
     */
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
        var todos   = getStrage() || [];
        var size    = todos.length;

        var SAVE_ID = "MyTodoApplication";

        function getStrage() {
            return JSON.parse(storage.getItem(SAVE_ID));
        };

        function setStrage(json) {
            storage.setItem(SAVE_ID, json);
        };

        /**
         * クラスをオブジェクトで管理するという方法もある
         * オブジェクトは、参照によって管理されているため実体は1つ
         * （Shallow Copyした場合は別）
         */
        return {
            /**
             * jsは変数に関数を代入することが出来る
             * 同じ感覚で、プロパティに関数を定義することもできる
             */
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

    /**
     * 他のクラス内で、このクラスを扱いたい場合はgetInstanceメソッドを
     * コールすることでinstanceを取得することができる
     */
    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})(sessionStorage);
