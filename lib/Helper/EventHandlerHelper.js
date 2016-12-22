"use babel";

import { Emitter } from 'atom'
export default class EventHandlerHelper
{
  constructor()
  {
    this.emitter = new Emitter();
  }

  onClose(callback)
  {
    this.emitter.on("maperwiki-wordcount-close",callback);
  }
  close()
  {
    this.emitter.emit("maperwiki-wordcount-close");
  }

  onViewWordcountFrame(callback)
  {
    this.emitter.on("maperwiki-wordcount-visibility",callback);
  }

  viewWordcountFrame(visible)
  {
    this.emitter.emit("maperwiki-wordcount-visibility",visible);
  }

  onCloseExportPanel(callback)
  {
    this.emitter.on("maperwiki-export-panel-close",callback);
  }

  closeExportPanel(visible)
  {
    this.emitter.emit("maperwiki-export-panel-close",visible);
  }

  onClear(callback)
  {
    this.emitter.on("clear-control",callback);
  }
  clear()
  {
    this.emitter.emit("clear-control");
  }

  destroy()
  {
    this.emitter.clear();
    this.emitter.dispose();
  }
}
