"use babel";

import { Emitter } from 'atom'
export default class EventHandlerHelper
{
  constructor()
  {
    this.emitter = new Emitter();
  }

  onClose(callback)
  {
    return this.emitter.on("maperwiki-wordcount-close",callback);
  }
  close()
  {
    this.emitter.emit("maperwiki-wordcount-close");
  }

  onViewWordcountFrame(callback)
  {
    return this.emitter.on("maperwiki-wordcount-visibility",callback);
  }

  viewWordcountFrame(visible)
  {
    this.emitter.emit("maperwiki-wordcount-visibility",visible);
  }

  onCloseExportPanel(callback)
  {
    return this.emitter.on("maperwiki-export-panel-close",callback);
  }

  closeExportPanel(visible)
  {
    this.emitter.emit("maperwiki-export-panel-close",visible);
  }

  onCloseSearchPanel(callback)
  {
    return this.emitter.on("maperwiki-search-panel-close",callback);
  }

  closeSearchPanel()
  {
    this.emitter.emit("maperwiki-search-panel-close");
  }
  onCloseSearchResultsPanel(callback)
  {
    return this.emitter.on("maperwiki-search-results-panel-close",callback);
  }

  closeSearchResultsPanel()
  {
    this.emitter.emit("maperwiki-search-results-panel-close");
  }

  onShowLinkCheckerPanel(callback)
  {
    return this.emitter.on("maperwiki-linkchecker-panel-show",callback);
  }

  showLinkCheckerPanel()
  {
    this.emitter.emit("maperwiki-linkchecker-panel-show");
  }

  onCloseLinkCheckerPanel(callback)
  {
    return this.emitter.on("maperwiki-linkchecker-panel-close",callback);
  }

  closeLinkCheckerPanel()
  {
    this.emitter.emit("maperwiki-linkchecker-panel-close");
  }

  onSearchInProgress(callback)
  {
    return this.emitter.on("maperwiki-search-in-progress",callback);
  }

  searchInProgress()
  {
    this.emitter.emit("maperwiki-search-in-progress" );
  }

  onSearchCompleted(callback)
  {
    return this.emitter.on("maperwiki-search-completed",callback);
  }

  searchCompleted()
  {
    this.emitter.emit("maperwiki-search-completed" );
  }
  onSearch(callback)
  {
    return this.emitter.on("maperwiki-search",callback);
  }

  search(data)
  {
    this.emitter.emit("maperwiki-search", data);
  }

  onSearchInWiki(callback)
  {
    return this.emitter.on("maperwiki-search-in-wiki",callback);
  }

  searchInWiki(data)
  {
    this.emitter.emit("maperwiki-search-in-wiki",data);
  }

  onNavigationHistoryChange(callback)
  {
    return this.emitter.on("maperwiki-navigation-history-change",callback);
  }

  navigationHistoryChange()
  {
    this.emitter.emit("maperwiki-navigation-history-change");
  }
  onClear(callback)
  {
    return this.emitter.on("clear-control",callback);
  }
  clear()
  {
    this.emitter.emit("clear-control");
  }

  destroy()
  {
    this.emitter.clear();
    this.emitter.dispose();
  }
}
