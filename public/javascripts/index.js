/**
 * 本アプリにおけるコントローラ的な役割を担う
 * Viewへの情報の受け渡しとモデル・イベントを呼び出している
 */

/*
 * jsにはセミコロンの自動挿入という厄介な機能が存在する
 * 圧縮・最適化などを行った際に直前のコードのセミコロンが省略されていた場合
 * エラーが発生してしまうことがある.
 * エラー防止のための案として、先頭にセミコロンを置くTipsである.
*/
;(function(window, $) {
    $(function (){
        /**
         * DOMへのアクセスはcacheしておくべき
         */
        var $task     = $('#js-input-task');
        var $limit    = $('#js-input-limit');
        var $priority = $('#js-input-priority');

        /**
         * windowオブジェクトは全てのグローバルオブジェクトであるため
         * それを利用して値をやりとりするという方法もある
         */
        var todoEvents = new window.TodoEvents($task, $limit, $priority);
        var todoModel  = new window.TodoModel.getInstance();

        /*
         * todoModelのinstance作成時にローカルストレージから値を取り出しているので
         * サイズが0以上であれば、Viewにそれを描画する
         */
        if (todoModel.getSize() > 0){
            var _createTemplate = window.Templates.getTodoTemplate;
            var i;
            var size = todoModel.getSize();
            var created = "";

            for (i = 0; i < size; i++){
                created += _createTemplate(v.task, v.limit, v.priority, v.check);
            }

            /*
             * 量にもよるが、appendを毎回ループで回すようなことをしてはいけない
             * なるべくDOM操作は少ないほうが良い
             */
            $('#js-todo-contents').append(created);
        }

        $('#js-todo-regist').on('click', function(e) {
            todoEvents.registTodo();
            var dto = makeDto($task.val(), $limit.val(), $priority.val(), false);
            todoModel.append(dto);
            todoModel.saveTodo()
        });

        /**
         * DOMによって追加される可能性のあるElementに対するイベントはを設定したい場合
         * 親要素をbindしonメソッドの第2引数で追加予定のElementを指定する
         * イベントハンドラはon, offメソッドで追加・削除することが推奨されている
         */
        $('#js-todo-contents').on('click', '.js-todo-delete', function(e) {
            var removeEvent = todoEvents.removeTodo.bind(this);
            var index = removeEvent();

            if (index < 0) return;
            todoModel.remove(index);
            todoModel.saveTodo();
        });

        $('#js-todo-contents').on('change', '.js-todo-check', function(e) {
            /*
             * bindはjsのthisを制御するための手法の1つである
             * 本来メソッドのthisはそれを呼び出した要素のスコープになっているが
             * 指定したオブジェクトのthisに束縛する
             * ただし、Browser対応はIE8以降
             */
            var updateEvent = todoEvents.changeTodoState.bind(this);
            var indexWithRow = updateEvent();

            if (indexWithRow.index < 0) return;
            var created = createTodoDto.bind(this);
            var dto = createTodoDto(indexWithRow.row);
            todoModel.update(indexWithRow.index, dto);
            todoModel.saveTodo()
        });

        $('#js-todo-contents').on('click', '.js-todo-update', function(e) {
            /*
             * Promise（Deffered）は非同期処理をうまく扱うためのメソッドです.
             * 一連の非同期処理を関数化することで、非同期処理を並列・直列に実行することができます.
             * Promiseオブジェクトには3つの状態がありpending(.state) resolved(.done) rejected(.fail)
             * 非同期処理の結果に応じて、それぞれに対応したcallback関数を呼び出すことができる.
             */
            var dfd = new $.Deferred();

            // 内部でinputタグとpタグを交換しているので
            // 先にmodelの部分を処理するしないとこのメソッド内で使用しているclosestが使えない
            var updateEvent = todoEvents.updateTodoTask.bind(this);
            updateEvent(dfd);

            // ユーザの入力後に更新処理を行うためPromiseを用いる
            // ※ $proxy = bindと同じ
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
        /*
         * ES5では関数でデフォルト引数を扱うことができない
         * そのため、以下のような形でデフォルト引数を実現する
         */
        return {
            task       : task     || ""
            , limit    : limit    || ""
            , priority : priority || 'low'
            , check    : check    || false
        };
    }

/**
 * jsは名前空間をサポートしない言語である
 * 変数や関数の衝突を防ぐための無名関数のローカルスコープに
 * 値を束縛するというTips（他にも、documentなどを渡す場合もある）
 */
})(this, jQuery);
