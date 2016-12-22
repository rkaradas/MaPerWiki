(function() {
  var arrayize, isString, trim;

  isString = function(str) {
    return typeof str === 'string' || str instanceof String;
  };

  trim = function(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };

  arrayize = function(arr) {
    var i, kv, len, obj, opt, ref;
    if (Array.isArray(arr)) {
      return arr;
    } else if (isString(arr)) {
      obj = {};
      ref = arr.split(";");
      for (i = 0, len = ref.length; i < len; i++) {
        opt = ref[i];
        kv = opt.split(":");
        obj[trim(kv[0])] = trim(kv[1]);
      }
      return [obj];
    } else {
      return [arr];
    }
  };

  module.exports = {
    computed: {
      computedStyle: function() {
        var style;
        style = arrayize(this.style);
        if (this.mergeStyle == null) {
          return style;
        }
        return arrayize(this.mergeStyle).concat(style);
      }
    }
  };

}).call(this);
