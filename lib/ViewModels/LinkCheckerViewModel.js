"use babel";
import Vue from "vue"

export default class LinkCheckerViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
  }

  closeLinkChecker()
  {
    this.eventHandler.closeLinkCheckerPanel();
  }
  createNewFile(brokenLink)
  {
    this.model.createNewFile(brokenLink);
  }

  linkTo(brokenLink, alternativeLink, result){
    this.model.linkTo(brokenLink, alternativeLink, result);
  }
  checkLinks()
  {
    this.model.findReferenceInfiles();
  }
}
