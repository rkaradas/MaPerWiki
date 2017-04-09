"use babel"

export default class SearchResultsModel
{

  init()
  {
    this.searchTerm = "";
    this.testVar = "";
    this.width = 400;
    this.height = 400;
    this.resizeHandleSize = 5;
    this.resizeMinSize = 100;
    this.isBusy = false;

    this.results = [];

  }


}
