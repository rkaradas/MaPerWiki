"use babel"


var ERROR_MSG_SEARCH_TERM = "Search term must not be empty and contain at least two letters.";
export default class SearchModel
{

  init()
  {
    this.searchTerm = "";
    this.isRegEx = false;
    this.isCaseSensitive = false;
    this.isWholeWord = false;
    this.status = " ";
  }

  setErrorStatus()
  {
    this.status = ERROR_MSG_SEARCH_TERM;
  }

}
