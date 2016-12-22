"use babel";
import Vue from "vue"

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
var selfInstance;

export default class WordcountStatusbarController
{
  constructor(view, viewModel)
  {
    var t0 = performance.now();
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;
    this.vue = new Vue({
        el: this.domElement,
        data: this.viewModel,

        methods: {
          openWordcountModalWindow: () => {
            this.viewModel.onOpenWordcountModalWindow();
          }
        }

      })

    atom.workspace.onDidChangeActivePaneItem(this.updateVisibility);

    this.updateVisibility(atom.workspace.getActivePaneItem());
    var t1 = performance.now();
    console.log("Call to WordcountStatusbarController.constructor for took " + (t1 - t0) + " milliseconds.")

      /* not neccessary, because the progressbar is already hidden within settings panel, but could be handy, when we bind a shortcut to the setting(s)
    atom.config.observe('MarPerWiki.alwaysOn', this.updateVisibilitySettingsChanged);
    atom.config.observe('MarPerWiki.noextension', this.updateVisibilitySettingsChanged);
    */
  }

  /* not neccessary
  updateVisibilitySettingsChanged(item)
  {
    selfInstance.updateVisibility(atom.workspace.getActivePaneItem());
  }
  */
  hide()
  {
    this.domElement.style.display = "none";
  }
  show()
  {
    this.domElement.style.display = "inline-block";
  }

  updateVisibility(item) {
      var alwaysOn, buffer, current_file_extension, extensions, no_extension, noextension, not_text_editor, ref, ref1, ref2, untitled_tab;
      ref = atom.config.get('MaPerWiki.Wordcount'), alwaysOn = ref.alwaysOn, extensions = ref.extensions, noextension = ref.noextension;
      extensions = (extensions || []).map(function(extension) {
        return extension.toLowerCase();
      });
      buffer = item != null ? item.buffer : void 0;
      not_text_editor = buffer == null;
      untitled_tab = (buffer != null ? buffer.file : void 0) === null;
      current_file_extension = buffer != null ? (ref1 = buffer.file) != null ? (ref2 = ref1.path.match(/\.(\w+)$/)) != null ? ref2[1].toLowerCase() : void 0 : void 0 : void 0;
      if (noextension && ((current_file_extension == null) || untitled_tab)) {
        no_extension = true;
      }
      if ( (alwaysOn || no_extension || indexOf.call(extensions, current_file_extension) >= 0) && !not_text_editor) {
        selfInstance.show();
      } else {
        selfInstance.hide();
      }

      if(!not_text_editor){
        selfInstance.viewModel.updateModel(item); // TextEditor item
      }

        /*
      */
    }

    dispose(){
      this.view.destroy();
    }


}
