"use babel";
import Vue from "vue"

export default class ExportViewModel
{
  constructor(model, eventHandler)
  {
    this.eventHandler = eventHandler;
    this.model = model;
    model.init();
  }
  onClose()
  {
    this.eventHandler.closeExportPanel();
  }
}
