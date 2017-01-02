"use babel";
import Vue from "vue"

export default class TocViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();
  }
  setResizerPosition(position)
  {
      this.model.setResizerPosition(position);
  }
  updateModel(editor,vueData)
  {
    var activeEditor = atom.workspace.getActiveTextEditor();
    this.model.updateData( activeEditor || editor, vueData );
  }
}
