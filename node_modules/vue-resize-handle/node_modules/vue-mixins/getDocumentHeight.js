(function() {
  var getDocumentHeight;

  getDocumentHeight = function() {
    var body, html;
    body = document.body;
    html = document.documentElement;
    return document.height || Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  };

  module.exports = {
    methods: {
      getDocumentHeight: getDocumentHeight
    }
  };

}).call(this);
