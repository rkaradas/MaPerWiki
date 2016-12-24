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
