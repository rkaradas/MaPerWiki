(function() {
  var allResizeCbs, callResizeCbs, hasMutationObserver, observer, resizeHandler, resizeRunning;

  hasMutationObserver = !!window.MutationObserver;

  if (hasMutationObserver) {
    resizeRunning = false;
    allResizeCbs = [];
    resizeHandler = function() {
      if (!resizeRunning) {
        resizeRunning = true;
        if (window.requestAnimationFrame) {
          return window.requestAnimationFrame(callResizeCbs);
        } else {
          return setTimeout(callResizeCbs, 66);
        }
      }
    };
    callResizeCbs = function(e) {
      var cb, i, len;
      for (i = 0, len = allResizeCbs.length; i < len; i++) {
        cb = allResizeCbs[i];
        cb(e);
      }
      return resizeRunning = false;
    };
    window.addEventListener("resize", resizeHandler);
    observer = new MutationObserver(resizeHandler);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  } else {
    require("javascript-detect-element-resize");
  }

  module.exports = {
    data: function() {
      return {
        resizeCbDisposables: []
      };
    },
    methods: {
      onElementResize: function(el, cb) {
        var cbwrapper, dispose, elheight, elwidth;
        if (cb == null) {
          return;
        }
        if (hasMutationObserver) {
          elheight = el.offsetHeight;
          elwidth = el.offsetWidth;
          cbwrapper = function(e) {
            if (elheight !== el.offsetHeight || elwidth !== el.offsetWidth) {
              elheight = el.offsetHeight;
              elwidth = el.offsetWidth;
              return cb(e);
            }
          };
          allResizeCbs.push(cbwrapper);
        } else {
          window.addResizeListener(el, cb);
        }
        dispose = function() {
          var index;
          if (hasMutationObserver) {
            index = allResizeCbs.indexOf(cbwrapper);
            if (index > -1) {
              return allResizeCbs.splice(index, 1);
            }
          } else {
            return window.removeResizeListener(el, cb);
          }
        };
        this.resizeCbDisposables.push(dispose);
        return (function(_this) {
          return function() {
            var index;
            index = _this.resizeCbDisposables.indexOf(dispose);
            if (index > -1) {
              _this.resizeCbDisposables.splice(index, 1);
              return dispose();
            }
          };
        })(this);
      }
    },
    beforeDestroy: function() {
      var i, len, ref, resizeCbDisposable, results;
      ref = this.resizeCbDisposables;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        resizeCbDisposable = ref[i];
        results.push(resizeCbDisposable());
      }
      return results;
    }
  };

}).call(this);
