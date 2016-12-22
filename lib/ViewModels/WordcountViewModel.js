"use babel";
import Vue from "vue"


export default class WordcountViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();
  }

  onClose()
  {
    this.eventHandler.viewWordcountFrame(false);
  }
  updateModel(editor)
  {
    this.model.updateCount(editor);
  }

}
