"use babel";
import Vue from "vue"

export default class SearchViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();
  }

  clearStatus()
  {
    this.model.status = " ";
  }

  setStatus(text)
  {
    this.model.status = text;
  }
  setErrorStatus()
  {
    this.model.setErrorStatus();
  }

  closeSearch()
  {
    this.eventHandler.closeSearchPanel();
    this.eventHandler.closeSearchResultsPanel();
  }
  onSearch()
  {
    this.eventHandler.search({
      searchTerm : this.model.searchTerm,
      isRegEx: this.model.isRegEx,
      isCaseSensitive: this.model.isCaseSensitive,
      isWholeWord: this.model.isWholeWord
    });
  }
  onSearchInWiki()
  {
    this.eventHandler.searchInWiki({
      searchTerm : this.model.searchTerm,
      isRegEx: this.model.isRegEx,
      isCaseSensitive: this.model.isCaseSensitive,
      isWholeWord: this.model.isWholeWord
    });
  }
}
