(function() {
  module.exports = {
    methods: {
      'getVue': function() {
        return Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor;
      }
    }
  };

}).call(this);
