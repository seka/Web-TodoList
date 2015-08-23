;(function() {
  function sanitizeTask(task) {
    if (task) {
      return task;
    }
    return '';
  }

  function sanitizeLimit(limit) {
    if (limit) {
      return limit;
    }
    var d = new Date();
    var year  = d.getFullYear();
    var month = d.getMonth() + 1;
    var day   = d.getDate();
    return year + '/' + month + '/' + day;
  }

  function sanitizePriority(priority) {
    if (priority === 'middle' || priority === 'high') {
      return priority;
    }
    return 'low';
  }

  window.Templates = {
    getTodoTemplate: function(obj) {
      var checkbox;
      if (obj.check) {
        checkbox = '<input type="checkbox" class="js-todo-check" checked="checked">';
      }
      else {
        checkbox = '<input type="checkbox" class="js-todo-check">';
      }

      var task;
      if (obj.check) {
        task = '<p class="js-todo-task js-todo-update todo-check">' + sanitizeTask(obj.task) + '</p>';
      }
      else {
        task = '<p class="js-todo-task js-todo-update todo-uncheck">' + sanitizeTask(obj.task) + '</p>';
      }

      // TODO:underscore.jsのテンプレートなどを使った方が見やすそう
      // js-prefixをつけるのを忘れてはいけない
      return (
        '<tr><td>' + task + '</td>'                                                                 +
          '<td><p class="js-todo-limit">' + sanitizeLimit(obj.limit) + '</p></td>'                  +
          '<td><p class="class="js-todo-priority">' + sanitizePriority(obj.priority) + '</p></td>'  +
          '<td>' + checkbox +'</td>'                                                                +
          '<td><button class="js-todo-delete">削除</button></td></tr>'
      );
    }
  };
})();
