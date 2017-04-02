'use babel'
import Vue from 'vue'

export default Vue.extend({
  name: 'small-text-editor',
/*
  template: "<atom-text-editor class='editor mini' tabindex='-1' mini data-grammar='text plain null-grammar' data-encoding='utf8'></atom-text-editor>",
*/

  beforeCompile: function () {
    var bp = "bp";
  },
  compiled: function(){
    this.$el.getModel().getBuffer().onDidStopChanging(()=>{
      this.text = this.$el.getModel().getBuffer().getText();
    });

    this.watcher = this.$watch('text', (text) => {
      var curPos = this.$el.getModel().getCursorBufferPosition();
      this.$el.getModel().getBuffer().setText(this.text);
      this.$el.getModel().setCursorBufferPosition(curPos);
    });
  },
  methods:{
    getTextEditor: function() {
      return this.$el.getModel()
    },
    focus: function(){
      this.$el.focus();
    }
  },
  props: ['text','placeholder']

})

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<atom-text-editor class='editor mini' tabindex='-1' mini data-grammar='text plain null-grammar' data-encoding='utf8' placeholder-text='{{placeholder}}'></atom-text-editor>"
