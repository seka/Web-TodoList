/**
 * 本アプリにおけるモデル処理を担当する
 * TODOのリストの管理を行っている他、ローカルストレージのアクセスも担当している
 */

window.TodoModel = (function(storage) {
  'use strict';

  /**
   * jsにおけるシングルトンパターンを実現するための方法の１つ
   * この実装方法による利点は、newを行なっても同じインスタンスが返却されることである.
   */
  var instance;

  var SAVE_ID = "MyTodoApplication";

  /**
   * init関数内でreturnされる以外のオブジェクトは
   * プライベートな関数・変数となっている
   */
  function init() {
    /* todosには以下のフォーマットのオブジェクトが格納される
     * todos = [
     *      {
     *          task: String,
     *          limit: Date,
     *          priority: enum('low', 'middle', 'high'),
     *          check: Bool
     *      },
     *      ...
     * ]
     */
    var todos   = getStrage() || [];
    var size    = todos.length;

    function getStrage() {
      return JSON.parse(storage.getItem(SAVE_ID));
    }

    /**
     * クラスをオブジェクトで管理するという方法もある
     * オブジェクトは、参照によって管理されているため実体は1つ
     */
    return {
      /**
       * jsは変数に関数を代入することが出来る
       * 同じ感覚で、プロパティに関数を定義することもできる
       */
      saveTodo: function() {
        // TODO: サイズに応じて、どうやってセーブするかを選択できるようにする
        var json = JSON.stringify(todos);
        return storage.setItem(SAVE_ID, json);
      },
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

  /**
   * newを行うと、getInstanceで生成されたオブジェクトが返却される
   * コンストラクタで自身のインスタンスをチェックしている
   */
  return {
    getInstance: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
})(window.localStorage);
