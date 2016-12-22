(function() {
  module.exports = {
    props: {
      "ignoreParent": {
        type: Boolean,
        "default": false
      },
      "parent": {
        type: Object
      }
    },
    data: function() {
      return {
        removeParentClickListener: null
      };
    },
    methods: {
      setupParent: function(parent) {
        if (parent == null) {
          parent = this.parent;
        }
        if (!this.ignoreParent) {
          if (typeof this.removeParentClickListener === "function") {
            this.removeParentClickListener();
          }
          parent.addEventListener("click", this.onParentClick);
          return this.removeParentClickListener = (function(_this) {
            return function() {
              return parent.removeEventListener("click", _this.onParentClick);
            };
          })(this);
        }
      }
    },
    watch: {
      "parent": "setupParent"
    },
    attached: function() {
      if (this.parent == null) {
        return this.parent = this.$el.parentElement;
      } else {
        return this.setupParent();
      }
    },
    dettached: function() {
      return typeof this.removeParentClickListener === "function" ? this.removeParentClickListener() : void 0;
    }
  };

}).call(this);
