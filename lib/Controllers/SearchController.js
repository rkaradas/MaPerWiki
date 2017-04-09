"use babel";
import Vue from "vue";
import TextEditorVue from '../VueComponents/small-text-editor'

var selfInstance;
export default class SearchController
{

  Init()
  {
    this.vue = new Vue({
      el: this.domElement,
      components: {
        "small-text-editor" : TextEditorVue
      },
      data: this.viewModel,
      methods: {
        closeSearch: () =>
        {
          this.viewModel.model.searchTerm = "";
          this.viewModel.closeSearch();
        },
        abortSearch()
        {
          selfInstance.viewModel.abortSearch();
        },
        setIsRegEx: ()=>
        {
            this.viewModel.model.isRegEx = !this.viewModel.model.isRegEx ;
        },
        setIsCaseSensitive: ()=>
        {
            this.viewModel.model.isCaseSensitive = !this.viewModel.model.isCaseSensitive ;
        },
        setIsWholeWord: () =>
        {
            this.viewModel.model.isWholeWord = !this.viewModel.model.isWholeWord ;
        },
        search: () =>
        {
          if(this.viewModel.model.searchTerm.trim() == "" || this.viewModel.model.searchTerm.trim().length < 2)
          {
            this.viewModel.setErrorStatus();
          }
          else{
            this.viewModel.clearStatus();
            this.viewModel.onSearch();
          }
        },
        searchInWiki: () =>
        {
          // the fastest way to get the complete text
          var txt = this.vue.$refs.searchElement.getTextEditor().getBuffer().getText();
          this.viewModel.model.searchTerm = txt;
          if(this.viewModel.model.searchTerm.trim() == "" || this.viewModel.model.searchTerm.trim().length < 2)
          {
            this.viewModel.setErrorStatus();
          }
          else{
            this.viewModel.clearStatus();
            this.viewModel.onSearchInWiki();
          }
        }

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
    console.log("Call to SearchController.constructor took " + (t1 - t0) + " milliseconds.")
  }

  focusSearchInput()
  {
    this.vue.$refs.searchElement.focus();
  }
  dispose(){
    this.view.destroy();
  }


}
