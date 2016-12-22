(function() {
  var getViewportOffset, getViewportSize, obj;

  obj = require("./getViewportSize");

  getViewportSize = obj.methods.getViewportSize;

  getViewportOffset = function(element) {
    var el, left, position, styles, top, viewportSize;
    if (element == null) {
      element = this.$el;
    }
    left = element.offsetLeft;
    top = element.offsetTop;
    el = element.parentElement;
    while (el) {
      styles = getComputedStyle(el);
      if (styles) {
        position = styles.getPropertyValue('position');
        left -= el.scrollLeft;
        top -= el.scrollTop;
        if (/relative|absolute|fixed/.test(position)) {
          left += parseInt(styles.getPropertyValue('border-left-width'), 10);
          top += parseInt(styles.getPropertyValue('border-top-width'), 10);
          left += el.offsetLeft;
          top += el.offsetTop;
          if (position === 'fixed') {
            break;
          }
        }
      }
      el = el.parentElement;
    }
    viewportSize = getViewportSize();
    return {
      top: top,
      bottom: viewportSize.height - element.offsetHeight - top,
      left: left,
      right: viewportSize.width - element.offsetWidth - left
    };
  };

  module.exports = {
    methods: {
      getViewportOffset: getViewportOffset
    }
  };

}).call(this);
