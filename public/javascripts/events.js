/**
 * 本アプリにおけるEvent処理を担当する
 * Eventに対応したDOM操作を行う
 */

/**
 * javascript におけるクラスの実現方法の１つ
 * 無名関数に束縛することで、この関数内でvar宣言された変数は
 * 外部からアクセスすることがができなくなる
 */
window.TodoEvents = (function($) {
    /**
     * Elementのオブジェクトであることを明示的に示すために
     * 接頭辞に$やelをつけることが多い
     */
    var $task;
    var $limit;
    var $priority;

    /**
     * 簡単なプライベート関数や変数を実現したければ、
     * アンダースコアを接頭辞につける
     * （アンダースコアがついたメソッドにはクラス外からアクセスしない
     */
    var _createTemplate = window.Templates.getTodoTemplate;

    function TodoEvents($task, $limit, $priority) {
        this.$task     = $task;
        this.$limit    = $limit;
        this.$priority = $priority;
    }

    /**
     * jsにおけるpublicの実現方法の1つ
     * jsはプロトタイプベースのオブジェクト指向を採用した言語であり
     * オブジェクトを生成した時点でprototypeというプロパティが自動付与される.
     * function で作られたオブジェクトには、空のオブジェクトが格納されている.
     * new 演算子を用いてコンストラクタとして実行された際に、
     * オブジェクトに設定されたprototypeを読み取り、オブジェクトに設定する.
     */
    TodoEvents.prototype.registTodo = function() {
        // TODO:本来であれば入力値のバリデーションを行う必要有り
        var templates = _createTemplate(this.$task.val(), this.$limit.val(), this.$priority.val());
        $('#js-todo-contents').append(templates);
    };

    TodoEvents.prototype.removeTodo = function() {
        /**
         * jQuery closetは開始要素から最も近い親要素を選択する便利なメソッドである
         * 親要素をさかのぼっていくため、コストは高い
         * 似たようなメソッドとして jQuery parents があるが、
         * parentsは引数と合致する要素を全て取得するという違いがある
         */
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

    /**
     * イベントのコールバック関数に対して引数を渡したい場合、
     * クロージャ使って実現できるというTips
     * 下の例で言うと、通常のイベントのコールバックでは、
     * EnterKeyを引数として渡すことができない
     */
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
            // 編集が完了したため、Promiseをresolve状態にする
            promise.resolve({ "index": $tr.index(), "row": $tr });
        };
    };

    // TODO:utilクラスに追い出しても良いかも？
    var swapTagWithValue = function($el1, $el2) {
        $el1.text($el2.val());
        $el2.replaceWith($el1);
    };

    /**
     * windowオブジェクトを通してクラスをやりとりする場合
     * 自身を返却することを忘れてはいけない
     */
    return TodoEvents;
})(jQuery);
