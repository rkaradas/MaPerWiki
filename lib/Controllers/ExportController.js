"use babel";
import Vue from "vue";
import VueResizeHandle from "vue-resize-handle/unidirectional";
import {Project, Directory, File} from 'atom'
import Glob from 'glob'
import Sortable from 'vue-sortable'
import PandocHelper from '../Helper/PandocHelper'
import fs from 'fs'
import path from 'path'
import TextEditorVue from '../VueComponents/small-text-editor'

var selfInstance;
export default class ExportController
{

  Init()
  {
    Vue.use(Sortable);
    this.vue = new Vue({
      el: this.domElement,
      components: {
        "resizer" : VueResizeHandle,
        "small-text-editor" : TextEditorVue
      },
      data: this.viewModel,
      methods: {
        close: () => this.viewModel.onClose(),
        testFunction: ()=> selfInstance.updateFilesToExport(),
        export:function(e)
        {
          var pandocHelper = new PandocHelper();
          pandocHelper.files = this.model.files;

          pandocHelper.convert(this.model.saveAs.trim(), this.model.pandocArgs
                            , this.model.fromFormat
                            , this.model.toFormat

                              );
        },
        // dragging ended
        onEnd: function (/**Event*/evt) {
            this.model.files.splice(evt.newIndex, 0,
              this.model.files.splice(evt.oldIndex, 1)[0]);
        },
        changeExtension: function(e)
        {
          if(this.model.saveAs){
            this.model.saveAs = this.model.saveAs.substr(0, this.model.saveAs.lastIndexOf(".")) + selfInstance.determineExtension();
          }
        },
        changeSelected: (file,e) => file.selected = !(file.selected)
      }
    });
  }

  constructor(view, viewModel)
  {
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;

    var t0 = performance.now();
    this.Init();
    var t1 = performance.now();
    console.log("Call to ExportController.constructor took " + (t1 - t0) + " milliseconds.")
  }

  updateFilesToExport()
  {

      var paths = atom.project.getPaths();
      this.viewModel.model.saveAs = path.join(paths[0], "document" + this.determineExtension());

      var filePaths = [];
      // options is optional
      //*Glob("**/*.js"
      this.viewModel.model.files = [];
      //Glob(paths[0] + "\\**\\*.@(md|pdf)", { ignore: paths[0] + '\\@(node_modules|a\.b)\\**\\*.*' }, function (er, files) {
      Glob(paths[0] + "/**/*.@(md)", { ignore: paths[0] + '/@(node_modules)/**/*.*' }, function (er, files) {
        files.forEach((itm, idx)=>{
          selfInstance.viewModel.model.files.push({'id':idx, selected: true, 'path':itm});
        });
      });
  }

  determineExtension()
  {
    switch (this.viewModel.model.toFormat)
    {
       case "markdown":
       case "markdown_github": return ".md";
       case "docx": return ".docx";
       default: return ".html";
    }
  }
  dispose(){
    this.view.destroy();
  }


}
