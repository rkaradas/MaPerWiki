"use babel";
import Vue from "vue";
import TextEditorVue from '../VueComponents/small-text-editor'
import VueResizeHandle from "vue-resize-handle/unidirectional";
import SearchHelper from "../Helper/SearchHelper"
import _ from "lodash"

var selfInstance;
export default class SearchResultsController
{

  Init()
  {
    Vue.filter('highlight', function(line, entryObject){
      // start and end are available, if entryObject contains range from TextEditor.scan(...)
      var start = entryObject.range[0];
      var end  =entryObject.range[1];

      // startProp and endProp are available, if entryObject contains range from workspace.scan(...)
      var startProp = entryObject.range.start;
      var endProp = entryObject.range.end;

      return selfInstance.highlightAndEscape(line,start?start[1]:startProp.column,end?end[1]:endProp.column, entryObject.lineTextOffset );

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
        },
        clearResults()
        {
          selfInstance.viewModel.model.results = [];
        },
        removeEntry(fileEntry)
        {
          var idxOfFileEntry;
          if( (idxOfFileEntry = selfInstance.viewModel.model.results.indexOf(fileEntry)) != -1 )
          {
            selfInstance.viewModel.model.results.splice(idxOfFileEntry, 1);
          }
        }
      }
    });
  }

  highlightAndEscape(s, startParam, endParam, offset) {
    var start = startParam - offset;
    var end = endParam - offset;
    var part = _.escape(s.substring(start, end));
    var replacement = '<span class=\'inline-block highlight-info\' style=\'margin-right:0;\'>' + part + '</span>'
    return _.escape(s.substring(0, start)) + replacement + _.escape(s.substring(end));
  }

  constructor(view, viewModel)
  {
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;
    this.searchHelper = new SearchHelper(this.viewModel.eventHandler);

    var t0 = performance.now();
    this.Init();
    var t1 = performance.now();
    console.log("Call to SearchResultsController.constructor took " + (t1 - t0) + " milliseconds.")
  }


  search(data)
  {
    this.searchHelper.search(data, (el, err)=> this.searchCallback(el,err));
  }

  searchInWiki(data)
  {
    this.searchHelper.searchInWiki(data, (el, err)=> this.searchCallback(el,err));
  }
  searchCallback(el, err)
  {
    if(err){
      atom.notifications.addError(err.message);
    }else{
      selfInstance.viewModel.model.results.unshift(el);// el represents the root search element
    }
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
