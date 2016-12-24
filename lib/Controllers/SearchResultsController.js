"use babel";
import Vue from "vue";
import TextEditorVue from '../VueComponents/small-text-editor'
import VueResizeHandle from "vue-resize-handle/unidirectional";
import SearchHelper from "../Helper/SearchHelper"

var selfInstance;
export default class SearchResultsController
{

  Init()
  {
    Vue.filter('highlight', function(words, query){
      return words.replace(query, '<span class=\'inline-block highlight-info\'>' + query + '</span>')
    });
    this.vue = new Vue({
      el: this.domElement,
      components: {
        "resizer" : VueResizeHandle,
        "small-text-editor" : TextEditorVue
      },
      data: this.viewModel,
      methods: {
        entryClicked: function (e) {
          // 1. open TextEditor, no matter if already opened
          // 2. Active TextEditor
          // 3. Go to marker and select word
          atom.workspace.open(e.filePath, {initialLine: 0, initialColumn: 0,searchAllPanes:true}).then((tEditor)=>{

            var te = tEditor;
            var pane = atom.workspace.paneForItem(te);
            pane.activateItem();
            te.setCursorBufferPosition([0,0]);
            atom.workspace.open(e.filePath, {initialLine: 0, initialColumn: 0,searchAllPanes:true}).then(()=>{
              selfInstance.goToMarker(e.range);

            });
          });
        },
        toggleResult(result)
        {
          result.showFileEntries = !result.showFileEntries;
        },
        toggleFileEntry(fileEntry)
        {
          fileEntry.showEntries = !fileEntry.showEntries;
        }
      }
    });
  }



  constructor(view, viewModel)
  {
    this.searchHelper = new SearchHelper();
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;

    var t0 = performance.now();
    this.Init();
    var t1 = performance.now();
    console.log("Call to SearchResultsController.constructor took " + (t1 - t0) + " milliseconds.")
  }


  search(data)
  {
    this.searchHelper.search(data, (el)=>{
      selfInstance.viewModel.model.results.unshift(el);// el represents the root search element
    });
  }

  searchInWiki(data)
  {
    this.searchHelper.searchInWiki(data, (el)=>{
      selfInstance.viewModel.model.results.unshift(el);// el represents the root search element
    });
  }



  goToMarker(range)
  {
    var editor = atom.workspace.getActiveTextEditor();
    // call two times, because Markdown preview enhanced also opens (if activated), so we loose focus
    atom.workspace.open(editor.getPath(),{searchAllPanes: true}).then(()=>{
    atom.workspace.open(editor.getPath(),{searchAllPanes: true})}).then(()=>{


      var displayMarker = editor.markBufferRange(range);
      var position = displayMarker.getStartBufferPosition();

      // Scroll to position
      editor.unfoldBufferRow(position.row);
      editor.setCursorBufferPosition(position);
      editor.scrollToCursorPosition();

      // Select found term
      editor.selectMarker(displayMarker);
    });
  }

  dispose(){
    this.view.destroy();
  }


}
