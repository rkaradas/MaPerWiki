"use babel"

export default class ExportModel
{

  init()
  {
    this.height = 500;
    this.resizeHandleSize = 5;
    this.resizeMinSize = 200;
    this.files = [];
    this.pandocArgs = "";
    this.saveAs = "";
    this.fromFormat = "markdown";
    this.toFormat = "html";
    this.isExportInProgress = false;
  }


}
