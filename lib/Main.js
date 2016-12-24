'use babel';

import { CompositeDisposable, File, Directory, Selection, Notification } from 'atom'
import _ from "lodash"
import packageConfig from './config-schema.json'

import Autosave from "./Viewless/Autosave"
import DragAndDrop from "./Viewless/DragAndDrop"
import LinkUpdater from "./Viewless/LinkUpdater"

import EventHandlerHelper from "./Helper/EventHandlerHelper"
import SearchHelper from "./Helper/SearchHelper"

import WordcountModel from "./Models/WordcountModel"
import WordcountView from './Views/WordcountView'
import WordcountViewModel from "./ViewModels/WordcountViewModel"
import WordcountController from "./Controllers/WordcountController"

import WordcountStatusbarView from './Views/WordcountStatusbarView'
import WordcountStatusbarViewModel from "./ViewModels/WordcountStatusbarViewModel"
import WordcountStatusbarController from "./Controllers/WordcountStatusbarController"

import TocModel from "./Models/TocModel"
import TocView from './Views/TocView'
import TocViewModel from "./ViewModels/TocViewModel"
import TocController from "./Controllers/TocController"

import ExportModel from "./Models/ExportModel"
import ExportView from './Views/ExportView'
import ExportViewModel from "./ViewModels/ExportViewModel"
import ExportController from "./Controllers/ExportController"

import SearchModel from "./Models/SearchModel"
import SearchView from './Views/SearchView'
import SearchViewModel from "./ViewModels/SearchViewModel"
import SearchController from "./Controllers/SearchController"

import SearchResultsModel from "./Models/SearchResultsModel"
import SearchResultsView from './Views/SearchResultsView'
import SearchResultsViewModel from "./ViewModels/SearchResultsViewModel"
import SearchResultsController from "./Controllers/SearchResultsController"


export default {
  mySandboxPackageStatusBarView: null,
  modalPanel: null,
  subscriptions: null,
  statusBarTile: null,
  config: packageConfig,
  update_count: null,
  selfInstance: null,
  autosave: null
  ,
  activate(state) {
    selfInstance = this;
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.eventHandler = new EventHandlerHelper();
    this.initializeWordcountPanelAndStatusbar(this.eventHandler, this.subscriptions);
    this.initializeTocPanel(this.eventHandler, this.subscriptions);

    this.autosave = new Autosave();
    this.dragAndDrop = new DragAndDrop(this.subscriptions);
    this.linkUpdater = new LinkUpdater(this.subscriptions);
    this.searchHelper = new SearchHelper(this.subscriptions);



    this.subscriptions.add(this.eventHandler.onSearch( (data) => {
      this.searchAndShowResults("search",data);
    }));

    this.subscriptions.add(this.eventHandler.onSearchInWiki( (data) => {
      this.searchAndShowResults("searchInWiki",data);
    }));

    // Register command that toggles the wordcountPanel
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'MaPerWiki:toggleWikiSearch': () => {

          if(!this.searchPanel) // if search Panel is null, then searchResultsPanel is also null
            this.initializeSearchPanel(this.eventHandler, this.subscriptions);


            if(this.searchPanel.isVisible())
            {
              this.searchPanel.hide();
              //this.exportController.updateFilesToExport();
            }
            else
            {
              this.searchPanel.show();
              //this.exportController.updateFilesToExport();
            }

          /*
          if(this.wordcountPanel)
          {
            this.ViewWordcountFrame(!this.wordcountPanel.isVisible());
          }
            this.ViewWordcountFrame(true);

            */
            //this.linkUpdater.findReferenceInfiles();


        }
    }));



        // Register command that toggles the wordcountPanel
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'MaPerWiki:toggleExport': () => {
        if(!this.exportPanel)
          this.initializeExportPanel(this.eventHandler, this.subscriptions);

          if(this.exportPanel.isVisible())
          {
            this.exportPanel.hide();
            this.exportController.updateFilesToExport();
          }
          else
          {
            this.exportPanel.show();
            this.exportController.updateFilesToExport();
          }
        }
    }));
    // Register command that toggles the wordcountPanel
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'MaPerWiki:toggleToc': () => {
        if(this.tocPanel.isVisible())
        {
          this.tocPanel.hide();
          this.tocController.setIsEnabled(false);
        }
        else
        {
          this.tocPanel.show();
          this.tocController.setIsEnabled(true);
        }

        return;
          var editor = atom.workspace.getActiveTextEditor();
          var grammar = editor.getGrammar();

          var lineCount = editor.getLineCount();
          for (var row = 0; row < lineCount; row++)
          {
            var lineText = grammar.tokenizeLine(editor.lineTextForBufferRow(row), null, row==0);
            var forBP1 = "for breakpoint";
          }

          //var tokenized = grammar.tokenizeLines(ate.getText());
          var forBP2 = "for breakpoint";
        }
    }));

    this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem ((item) => {
      var editor, grammars, isMarkdown;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        isMarkdown = false;
      }else{
        grammars = ["source.gfm", "source.gfm.nvatom", "source.litcoffee", "text.md", "text.plain", "text.plain.null-grammar"];//atom.config.get('tool-bar-markdown-writer.grammars');
        isMarkdown = grammars.indexOf(editor.getGrammar().scopeName) >= 0;
      }
      if(this.toolBar)
        this.toolBar.removeItems();

      if(isMarkdown && this.toolBar)
      {
        this.addToolbarButtons();
      }else{

      }


    }));





    // read all config from ./config-schema.json
    // config  = atom.config.get('MaPerWiki');
  },
  searchAndShowResults(searchType, data)
  {
    if(!this.searchResultsPanel)
      this.initializeSearchResultsPanel(this.eventHandler, this.subscriptions);
    if(!this.searchResultsPanel.isVisible() )
    {
      this.searchResultsPanel.show();
    }

    if(searchType == "search")
      this.searchResultsController.search(data);
    else if(searchType == "searchInWiki")
      this.searchResultsController.searchInWiki(data);

  },
  addToolbarButtons(){

    // Using custom icon set (Ionicons)
    const button = this.toolBar.addButton({
      icon: 'sort-variant', //'file-document-box',//'view-headline',
      callback: 'MaPerWiki:toggle',
      tooltip: 'Toggle TOC',
      iconset: 'mdi',
      priority: 1
    });
  },
  ViewWordcountFrame(visible){
    if(visible){
      this.wordcountPanel.show();
    }else {
      this.wordcountPanel.hide();
    }
  },
  ViewTocFrame(visible){
    if(visible){
      this.tocPanel.show();
    }else {
      this.tocPanel.hide();
    }
  },
  deactivate() {
    this.autosave.deactivateAutosave();
    this.wordcountController.dispose();
    this.statusbarController.dispose();
    this.tocController.dispose();
    this.subscriptions.clear();
    this.subscriptions.dispose();
    this.eventHandler.destroy();

    if (this.toolBar) {
      this.toolBar.removeItems();
      this.toolBar = null;
    }
  },
  serialize() {
    /* May be useful, when we need to serialize the state
    return {
      mySandboxPackageViewState: this.mySandboxPackageView.serialize()
    };
    */
  },

  testfunction(){
  }
  ,
  consumeStatusBar: function(statusBar){
    this.statusBarTile = statusBar.addRightTile({
      item: this.statusbarController.domElement ,
      priority: 100
    });
  },
  consumeToolBar(getToolBar) {
    this.toolBar = getToolBar('MaPerWiki');
    this.addToolbarButtons();
    // Add buttons and spacers here...
  },
  initializeExportPanel(handler, subscription)
  {
    var t0 = performance.now();
    this.exportModel = new ExportModel();
    var exportView = new ExportView();
    // may push viewmodel into an array, so we can dispose later
    var exportViewModel = new ExportViewModel(this.exportModel,handler);
    this.exportController = new ExportController(exportView,exportViewModel);
    this.exportPanel = atom.workspace.addBottomPanel({
      item: this.exportController.domElement,
      visible: false,
      priority: 1000
    });

    subscription.add(this.eventHandler.onCloseExportPanel( (visible) => this.exportPanel.hide() ));
    var t1 = performance.now();
    console.log("Call to complete ExportPanel init took " + (t1 - t0) + " milliseconds.")
  },
  initializeSearchPanel(handler, subscription)
  {
    var t0 = performance.now();
    this.searchModel = new SearchModel();
    var searchView = new SearchView();

    var searchViewModel = new SearchViewModel(this.searchModel,handler);
    this.searchController = new SearchController(searchView,searchViewModel);
    this.searchPanel = atom.workspace.addBottomPanel({
      item: this.searchController.domElement,
      visible: false,
      priority: 1000
    });

    subscription.add(this.eventHandler.onCloseSearchPanel( () => this.searchPanel.hide() ));
    var t1 = performance.now();
    console.log("Call to complete SearchPanel init took " + (t1 - t0) + " milliseconds.")
  },
  initializeSearchResultsPanel(handler, subscription)
  {
    var t0 = performance.now();
    this.searchResultsModel = new SearchResultsModel();
    var searchResultsView = new SearchResultsView();

    var searchResultsViewModel = new SearchResultsViewModel(this.searchResultsModel,handler);
    this.searchResultsController = new SearchResultsController(searchResultsView,searchResultsViewModel);
    this.searchResultsPanel = atom.workspace.addBottomPanel({
      item: this.searchResultsController.domElement,
      visible: false,
      priority: 900
    });

    subscription.add(this.eventHandler.onCloseSearchResultsPanel( () =>{
      if(this.searchResultsPanel)
        this.searchResultsPanel.hide();
    }));
    var t1 = performance.now();
    console.log("Call to complete SearchResultsPanel init took " + (t1 - t0) + " milliseconds.")
  },
  initializeTocPanel(handler, subscription)
  {
    var t0 = performance.now();
    this.tocModel = new TocModel();
    var tocView = new TocView();
    // may push viewmodel into an array, so we can dispose later
    var tocViewModel = new TocViewModel(this.tocModel,handler);
    this.tocController = new TocController(tocView,tocViewModel);
    this.tocPanel = atom.workspace.addLeftPanel({
      item: this.tocController.domElement,
      visible: atom.config.get("MaPerWiki.TOC.tocOn"),
      priority: 1000
    });
    var t1 = performance.now();
    console.log("Call to complete TocPanel init took " + (t1 - t0) + " milliseconds.")
  },
  initializeWordcountPanelAndStatusbar(handler, subscription){

    var t0 = performance.now();
    this.wordcountModel = new WordcountModel();

    // WORDCOUNT PANEL
    var wordcountView = new WordcountView();
    // may push viewmodel into an array, so we can dispose later
    var wordcountViewModel = new WordcountViewModel(this.wordcountModel,handler);

    this.wordcountController = new WordcountController(wordcountView,wordcountViewModel);
    this.wordcountPanel = atom.workspace.addModalPanel({
      item: this.wordcountController.domElement,
      visible: false
    });


    var t1 = performance.now();
    console.log("Call to complete WordcountPanel init took " + (t1 - t0) + " milliseconds.")


    var t2 = performance.now();
    // WORDCOUNT STATUSBAR
    this.statusbarView = new WordcountStatusbarView();

    // may push viewmodel into an array, so we can dispose later
    var statusbarViewModel = new WordcountStatusbarViewModel(this.wordcountModel,handler);

    // not local, cause we need to referenc it in consumeStatusBar
    this.statusbarController = new WordcountStatusbarController(this.statusbarView,statusbarViewModel);

    /*
      Observe texteditors, in order to update number of words, etc.
    */

    atom.workspace.observeTextEditors((editor)=>{
      var updateCount;
      //updateCount = _.throttle(()=>{
      updateCount = ()=>{
        if(atom.workspace.getActiveTextEditor() === editor)
          selfInstance.wordcountModel.updateCount(editor);
      };
      //},300);

      editor.onDidChange(updateCount);
      editor.onDidChangeSelectionRange(updateCount);
    });

    /*
      Register Wordcount event(s)
     */
    subscription.add(this.eventHandler.onViewWordcountFrame( (visible) => this.ViewWordcountFrame(visible) ));

    var t3 = performance.now();
    console.log("Call to complete WordcountStatusbar init took " + (t3 - t2) + " milliseconds.")
  }


};
