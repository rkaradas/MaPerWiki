"use babel";
import Vue from "vue"

export default class SearchResultsViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();

  }
}
