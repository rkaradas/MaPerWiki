(function() {
  module.exports = {
    methods: {
      fragToString: function(frag) {
        var div;
        div = document.createElement("div");
        div.appendChild(frag.cloneNode(true));
        return div.innerHTML;
      }
    }
  };

}).call(this);
