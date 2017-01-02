'use babel';

import { CompositeDisposable, File, Directory, Selection, Notification } from 'atom'
import _ from "lodash"
import packageConfig from './config-schema.json'

import Autosave from "./Viewless/Autosave"
import DragAndDrop from "./Viewless/DragAndDrop"
/*import LinkUpdater from "./Viewless/LinkUpdater" */

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
import TocController from "./Controllers/TocController" //import {TocController} from "./Controllers"

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

import LinkCheckerModel from "./Models/LinkCheckerModel"
import LinkCheckerView from './Views/LinkCheckerView'
import LinkCheckerViewModel from "./ViewModels/LinkCheckerViewModel"
import LinkCheckerController from "./Controllers/LinkCheckerController"

import LinkCheckerStatusbarView from './Views/LinkCheckerStatusbarView'
import LinkCheckerStatusbarViewModel from "./ViewModels/LinkCheckerStatusbarViewModel"
import LinkCheckerStatusbarController from "./Controllers/LinkCheckerStatusbarController"


export default {
  subscriptions: null,
  config: packageConfig,
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
    this.initializeLinkCheckerStatusbar(this.eventHandler, this.subscriptions);

    this.autosave = new Autosave();
    this.dragAndDrop = new DragAndDrop(this.subscriptions);
    //this.linkUpdater = new LinkUpdater(this.subscriptions);
    this.searchHelper = new SearchHelper(this.subscriptions);


    // Register disposables (commands, events)
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'MaPerWiki:toggleWikiSearch': () => this.toggleWikiSearch(),
        'MaPerWiki:toggleExport': () => this.toggleExport(),
        'MaPerWiki:toggleToc': () => this.toggleToc(),
        'MaPerWiki:toggleLinkChecker': () => this.toggleLinkChecker(),
        'MaPerWiki:switchTocLeftRight': () => this.switchTocLeftRight()

      }),
      this.eventHandler.onSearch( (data) => this.searchAndShowResults("search",data) ),
      this.eventHandler.onSearchInWiki( (data) => this.searchAndShowResults("searchInWiki",data) ),
      this.eventHandler.onShowLinkCheckerPanel( () => this.toggleLinkChecker() ),
      this.eventHandler.onCloseLinkCheckerPanel( () => this.toggleLinkChecker(true) )

    );

    atom.config.observe('MaPerWiki.TOC.tocPanelPosition', (value) => this.addTocPanel());

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
  closeAllPanels(edge)
  {
    var panels;
    switch(edge) {
      case "left":
          panels = atom.workspace.getLeftPanels();
          break;
      case "right":
          panels = atom.workspace.getRightPanels();
          break;
      case "top":
          panels = atom.workspace.getTopPanels();
          break;
      default:
          panels = atom.workspace.getBottomPanels();
    }
    panels.forEach((itm)=>
    {
      itm.hide();
    });
  },
  // this is for menu entry switch position.
  // after we set the position in the config, it triggers the observer,
  // where the actual panel switching happens
  switchTocLeftRight()
  {
    var pos = atom.config.get('MaPerWiki.TOC.tocPanelPosition');
    atom.config.set('MaPerWiki.TOC.tocPanelPosition', pos=="left"?"right":"left");
  },
  toggleToc()
  {
    if(this.tocPanel.isVisible())
    {
      this.tocPanel.hide();
      this.tocController.setIsEnabled(false);
    }
    else
    {
      this.closeAllPanels();
      this.tocPanel.show();
      this.tocController.setIsEnabled(true);
    }
  },
  toggleExport()
  {
    if(!this.exportPanel)
      this.initializeExportPanel(this.eventHandler, this.subscriptions);

    if(this.exportPanel.isVisible())
    {
      this.exportPanel.hide();
      this.exportController.updateFilesToExport();
    }
    else
    {
      this.closeAllPanels();
      this.exportPanel.show();
      this.exportController.updateFilesToExport();
    }
  },
  toggleWikiSearch()
  {
    if(!this.searchPanel)
      this.initializeSearchPanel(this.eventHandler, this.subscriptions);

    if(this.searchPanel.isVisible())
    {
      this.searchPanel.hide();
      // trigger: close search results panel
      this.eventHandler.closeSearchResultsPanel();
    }
    else
    {
      this.closeAllPanels();
      this.searchPanel.show();
    }
  },

  toggleLinkChecker(hide)
  {
    if(!this.linkCheckerPanel)
      this.initializeLinkChecker(this.eventHandler, this.subscriptions);

    if(this.linkCheckerPanel.isVisible() || hide)
    {
      this.linkCheckerPanel.hide();
    }
    else
    {
      this.linkCheckerController.checkLinks();
      this.closeAllPanels();
      this.linkCheckerPanel.show();
    }
  }
  ,
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

    // add toc toolbar button
    const tocButton = this.toolBar.addButton({
      icon: 'sort-variant',
      callback: {'' : 'MaPerWiki:toggleToc'},
      tooltip: 'Toggle TOC',
      iconset: 'mdi',
      priority: 1
    });
    // add link checker toolbar button
    const linkCheckerButton = this.toolBar.addButton({
      icon: 'chain-broken',
      callback: 'MaPerWiki:toggleLinkChecker',
      tooltip: 'Toggle link checker',
      iconset: 'fa',
      priority: 2
    });
    const wikiSearchButton = this.toolBar.addButton({
      icon: 'search',
      callback: 'MaPerWiki:toggleWikiSearch',
      tooltip: 'Toggle Wiki search',
      iconset: 'fa',
      priority: 3
    });
    const exportButton = this.toolBar.addButton({
      icon: 'export',
      callback: 'MaPerWiki:toggleExport',
      tooltip: 'Toggle Export',
      iconset: 'mdi',
      priority: 4
    });
    this.toolBar.addSpacer(5);
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
  consumeStatusBar: function(statusBar){
    this.wordcountStatusbarTile = statusBar.addRightTile({
      item: this.statusbarController.domElement ,
      priority: 100
    });
    this.linkCheckerStatusbarTile = statusBar.addRightTile({
      item: this.linkCheckerStatusbarController.domElement ,
      priority: 100
    });
  },
  consumeToolBar(getToolBar) {
    this.toolBar = getToolBar('MaPerWiki');
    this.addToolbarButtons();
  },
  initializeLinkChecker(handler, subscription)
  {
    var t0 = performance.now();
    var linkCheckerView = new LinkCheckerView();

    var linkCheckerViewModel = new LinkCheckerViewModel(this.linkCheckerModel,handler);
    this.linkCheckerController = new LinkCheckerController(linkCheckerView,linkCheckerViewModel);

    this.linkCheckerPanel = atom.workspace.addBottomPanel({
      item: this.linkCheckerController.domElement,
      visible: false,
      priority: 900
    });
    var t1 = performance.now();
    console.log("Call to complete LinkCheckerPanel init took " + (t1 - t0) + " milliseconds.")
  },
  initializeLinkCheckerStatusbar(handler, subscription)
  {
    var t0 = performance.now();
    this.linkCheckerModel = new LinkCheckerModel();
    var linkCheckerStatusbarView = new LinkCheckerStatusbarView();
    // may push viewmodel into an array, so we can dispose later
    var linkCheckerStatusbarViewModel = new LinkCheckerStatusbarViewModel(this.linkCheckerModel,handler);
    this.linkCheckerStatusbarController = new LinkCheckerStatusbarController(linkCheckerStatusbarView,linkCheckerStatusbarViewModel);

    var t1 = performance.now();
    console.log("Call to complete LinkCheckerStatusbar init took " + (t1 - t0) + " milliseconds.")
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
      priority: 1100 // lower = closer to the edge
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
      priority: 1000 // lower = closer to the edge
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
      priority: 999 // lower = closer to the edge
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

    this.addTocPanel();

    var t1 = performance.now();
    console.log("Call to complete TocPanel init took " + (t1 - t0) + " milliseconds.")
  },
  addTocPanel()
  {
    var pos = atom.config.get('MaPerWiki.TOC.tocPanelPosition');
    var tocPanelOptions = {
      item: this.tocController.domElement,
      visible: atom.config.get("MaPerWiki.TOC.tocOn"),
      priority: 1000
    };

    // destroy previous toc panel, if exists
    if(this.tocPanel)
      this.tocPanel.destroy();

    this.tocPanel = (pos == "left") ? atom.workspace.addLeftPanel(tocPanelOptions) : atom.workspace.addRightPanel(tocPanelOptions);

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
