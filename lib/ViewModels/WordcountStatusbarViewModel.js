"use babel";
import Vue from "vue"

export default class WordcountStatusbarViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();
  }

  onOpenWordcountModalWindow()
  {
    this.eventHandler.viewWordcountFrame(true);
  }
  updateModel(editor)
  {
    this.model.updateCount(editor);
  }
}
