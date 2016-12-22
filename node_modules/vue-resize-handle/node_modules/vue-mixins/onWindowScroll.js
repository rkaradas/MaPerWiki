(function() {
  var allScrollCbs, callScrollCbs, scrollHandler, scrollRunning;

  scrollRunning = false;

  allScrollCbs = [];

  scrollHandler = function() {
    var args;
    if (!scrollRunning) {
      args = arguments;
      scrollRunning = true;
      if (window.requestAnimationFrame) {
        return window.requestAnimationFrame(function() {
          return callScrollCbs.apply(null, args);
        });
      } else {
        return setTimeout((function() {
          return callScrollCbs.apply(null, args);
        }), 66);
      }
    }
  };

  callScrollCbs = function() {
    var cb, i, len;
    for (i = 0, len = allScrollCbs.length; i < len; i++) {
      cb = allScrollCbs[i];
      cb.apply(null, arguments);
    }
    return scrollRunning = false;
  };

  window.addEventListener("scroll", scrollHandler);

  module.exports = {
    data: function() {
      return {
        scrollCbDisposables: []
      };
    },
    methods: {
      onWindowScroll: function(cb) {
        var dispose;
        allScrollCbs.push(cb);
        dispose = function() {
          var index;
          index = allScrollCbs.indexOf(cb);
          if (index > -1) {
            return allScrollCbs.splice(index, 1);
          }
        };
        this.scrollCbDisposables.push(dispose);
        return (function(_this) {
          return function() {
            var index;
            dispose();
            index = _this.scrollCbDisposables.indexOf(dispose);
            if (index > -1) {
              return _this.scrollCbDisposables.splice(index, 1);
            }
          };
        })(this);
      }
    },
    beforeDestroy: function() {
      var i, len, ref, results, scrollCbDisposable;
      ref = this.scrollCbDisposables;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        scrollCbDisposable = ref[i];
        results.push(scrollCbDisposable());
      }
      return results;
    }
  };

}).call(this);
