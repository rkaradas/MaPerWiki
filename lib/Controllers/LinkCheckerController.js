"use babel";
import Vue from "vue";
import VueResizeHandle from "vue-resize-handle/unidirectional";

var selfInstance;
export default class LinkCheckerController
{

  Init()
  {
    this.vue = new Vue({
      el: this.domElement,
      components: {
        "resizer" : VueResizeHandle,
      },
      data: this.viewModel,
      methods: {
        entryClicked: (brokenLink) => {
          this.openAndGoToMarker(brokenLink);
        },
        createNewFile: (brokenLink)=>{
          this.viewModel.createNewFile(brokenLink);
        },
        linkTo: (brokenLink, alternativeLink, result)=>{
          this.openAndGoToMarker(brokenLink, alternativeLink, result, (bl, al, r)=>this.viewModel.linkTo(bl, al, r));
        },
        onCloseLinkCheckerClick: ()=>{
          this.viewModel.closeLinkChecker();
        },
        checkLinks: ()=>{
          this.checkLinks();
        }
      }
    });
  }
  checkLinks()
  {
    this.viewModel.checkLinks();
  }
  openAndGoToMarker(brokenLink, alternativeLink, result, callback)
  {
    // 1. open TextEditor, no matter if already opened
    // 2. Active TextEditor
    // 3. Go to marker and select word
    atom.workspace.open(brokenLink.filePath, {initialLine: 0, initialColumn: 0,searchAllPanes:true}).then((tEditor)=>{

      var te = tEditor;
      var pane = atom.workspace.paneForItem(te);
      pane.activateItem();
      te.setCursorBufferPosition([0,0]);
      atom.workspace.open(brokenLink.filePath, {initialLine: 0, initialColumn: 0,searchAllPanes:true}).then(()=>{
        selfInstance.goToMarker(brokenLink.range, brokenLink, alternativeLink, result, callback);

      });
    });
  }

  goToMarker(range, brokenLink, alternativeLink, result, callback)
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
    }).then(()=>{
      if(callback)
        callback(brokenLink, alternativeLink, result);
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
    console.log("Call to LinkCheckerController.constructor took " + (t1 - t0) + " milliseconds.")
  }

  dispose(){
    this.view.destroy();
  }


}
