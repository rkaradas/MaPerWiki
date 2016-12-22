(function() {
  module.exports = {
    computed: {
      Vue: function() {
        return Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor;
      }
    }
  };

}).call(this);
