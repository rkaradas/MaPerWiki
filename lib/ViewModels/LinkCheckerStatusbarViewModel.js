"use babel";
import Vue from "vue"

export default class LinkCheckerStatusbarViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();
  }

  showLinkChecker()
  {
    this.eventHandler.showLinkCheckerPanel();
  }

}
