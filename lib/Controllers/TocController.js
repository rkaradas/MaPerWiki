"use babel";
import Vue from "vue";
import VueResizeHandle from "vue-resize-handle/unidirectional";
//import {Keen} from 'keen-ui';
import TreeView from "../VueComponents/treeview.js"

var selfInstance;
export default class TocController
{
  constructor(view, viewModel)
  {
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;

    var t0 = performance.now();
    //Vue.use(Keen);
    this.vue = new Vue({
        el: this.domElement,
        components: {
          "resizer" : VueResizeHandle,
          "treeview": TreeView
        },
        data: this.viewModel,
        methods: {
          onItemClick: function (e) {
            var el = e.model;
            var dataMarkerId = el.markerId;
            selfInstance.goToMarker(dataMarkerId);
          },
          onItemToggle: function (e) {
              //console.log('toggle', e);
          },
          onItemExpand: function (e) {
              //console.log('expand', e);
          },
          onItemCollapse: function (e) {
              //console.log('toggle', e);
          },
          collapseAll: function () {
              this.$refs.basicTreeview.collapseAll();
          },
          expandAll: function () {
              this.$refs.basicTreeview.expandAll();

          },
          updateToc: () => {
            this.refreshData();
          }
        }
      });
      this.domElement.style.display = "flex";

      atom.workspace.onDidChangeActivePaneItem(()=>{
        //ToDo: Based on config, e.g. file extension, or overall Visibility
        selfInstance.updateVisibility();
        //ToDo: refreshData, based on config, e.g. always refresh , or stick with the last known data from given file extension
        selfInstance.refreshData();

      });

      atom.config.observe("MaPerWiki.TOC.tocOn",(value)=>{
        selfInstance.updateVisibility(value);
        if(value)
        {
          selfInstance.refreshData();
        }
      });
      atom.config.observe('MaPerWiki.TOC.tocPanelPosition', (value) => {
        selfInstance.viewModel.setResizerPosition(value=="left"?"right":"left");
      });

      var t1 = performance.now();
      console.log("Call to TocController.constructor took " + (t1 - t0) + " milliseconds.")
  }

  goToMarker(markerId)
  {
    // call two times, because Markdown preview enhanced also opens (if activated), so we loose focus
    atom.workspace.open(this.viewModel.model.editor.getPath(),{searchAllPanes: true}).then(()=>{
    atom.workspace.open(this.viewModel.model.editor.getPath(),{searchAllPanes: true})}).then(()=>{

        var editor = atom.workspace.getActiveTextEditor();
        var marker = editor.getMarker(markerId);
        if(!marker)
          return;

        var position = marker.getStartBufferPosition();

        editor.unfoldBufferRow(position.row);
        editor.setCursorBufferPosition(position);
        editor.scrollToCursorPosition();
    });
  }

  refreshData()
  {
    if(atom.config.get("MaPerWiki.TOC.tocOn")){
      var activeTE = atom.workspace.getActiveTextEditor();
      if(atom.workspace.isTextEditor(activeTE)){
        var grammar = activeTE.getGrammar();
        if(grammar.name.toLowerCase() == "github markdown")
        {
          // we have to pass the data from vue instance, so vue can do the background magic :)
          // refer to http://vuejs.org/guide/list.html#Array-Change-Detection for more information
          selfInstance.viewModel.updateModel(activeTE, selfInstance.vue.$data.model.treeData);

        }

      }
    }
  }

  hide()
  {
    this.domElement.style.display = "none";
    //this.vue.$data.showTree = false;
  }
  show()
  {
    this.domElement.style.display = "flex";
    //this.vue.$data.showTree = true;
  }

  setIsEnabled(val)
  {
    atom.config.set("MaPerWiki.TOC.tocOn",val?true:false);
  }

  // updates the visibility
  updateVisibility(isVisible)
  {
    (isVisible||atom.config.get("MaPerWiki.TOC.tocOn")) ? selfInstance.show() : selfInstance.hide();
  }



  dispose(){
    this.view.destroy();
  }


}
