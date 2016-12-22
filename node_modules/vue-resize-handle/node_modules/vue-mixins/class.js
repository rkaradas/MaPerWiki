(function() {
  var isString, processInput;

  isString = function(str) {
    return typeof str === 'string' || str instanceof String;
  };

  processInput = function(obj) {
    var isArray;
    isArray = Array.isArray(obj);
    if (isString(obj) && !isArray) {
      obj = obj.split(" ");
      isArray = true;
    }
    return {
      isArray: isArray,
      obj: obj
    };
  };

  module.exports = {
    computed: {
      computedClass: function() {
        var i, isArray1, isArray2, item, j, key, len, len1, obj1, obj2, ref, ref1, result, val;
        ref = processInput(this["class"]), isArray1 = ref.isArray, obj1 = ref.obj;
        if (this.mergeClass == null) {
          return obj1;
        }
        ref1 = processInput(this.mergeClass), isArray2 = ref1.isArray, obj2 = ref1.obj;
        if (isArray1 && isArray2) {
          return obj2.concat(obj1);
        } else {
          result = {};
          if (isArray2) {
            for (i = 0, len = obj2.length; i < len; i++) {
              item = obj2[i];
              if (isString(item)) {
                result[item] = true;
              } else {
                for (key in item) {
                  val = item[key];
                  result[key] = val;
                }
              }
            }
          } else {
            for (key in obj2) {
              val = obj2[key];
              result[key] = val;
            }
          }
          if (isArray1) {
            for (j = 0, len1 = obj1.length; j < len1; j++) {
              item = obj1[j];
              if (isString(item)) {
                result[item] = true;
              } else {
                for (key in item) {
                  val = item[key];
                  result[key] = val;
                }
              }
            }
          } else {
            for (key in obj1) {
              val = obj1[key];
              result[key] = val;
            }
          }
          return result;
        }
      }
    }
  };

}).call(this);
