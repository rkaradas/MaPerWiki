"use babel"

import {Project, Directory, File} from 'atom'

export default class ExportModel
{

  init()
  {
    this.height = 500;
    this.resizeHandleSize = 5;
    this.resizeMinSize = 200;
    this.files = { "ExportSelection": []};
    //this.files = { "Exportfiles": [], "ExportSelection": []};
    this.disable = false;
    this.pandocArgs = "";
    this.saveAs = "";
    this.fromFormat = "markdown";
    this.toFormat = "html";
    this.isExportInProgress = false;
    this.showExportConfig = false;
    this.customUserExports;
    this.loadCustomUserExports();
  }

  addFileToExportSelectionRoot(itm)
  {
    var bn = itm.getBaseName();
    if(bn.match(/\.(md)$/))
    {
      this.files["ExportSelection"].push({"type": "item", "id": itm.getPath(), "group": itm.getParent().getPath(),  "text": itm.getBaseName()});
    }
  }

  addFolderToExportSelectionRoot(folderPath)
  {
    var itm = new Directory(folderPath)
    var cols = [];
    var possibleContainer = {"type": "container",
                "id" : itm.getPath(),
                "text": itm.getBaseName(),
                "columns": cols,
                "hideList": false};
    var hasAtLeastOneMdFile = this.walkDirectoryTree(itm.getPath(), cols);
    if(hasAtLeastOneMdFile){
      this.files["ExportSelection"].push(possibleContainer);
    }
  }
  loadCustomUserExports()
  {
    this.customUserExports = [];
    var customUserExports = atom.config.get("MaPerWiki.Export.customUserExports");
    customUserExports.forEach((itm,idx)=>{
      this.customUserExports.push(itm);
    });
  }
  saveCustomUserExports()
  {
    atom.config.set("MaPerWiki.Export.customUserExports", this.customUserExports);
  }
  walkExportFiles(root, filesArray)
  {
    root.forEach((itm)=>{
      if(itm.type == "container")
      {
        this.walkExportFiles(itm.columns,filesArray);
      }else{
        filesArray.push(itm.id);
      }
    });
  }

  getExportFiles()
  {
    var resultArray = [];
    this.walkExportFiles(this.files.ExportSelection, resultArray);
    return resultArray;
  }

  walkDirectoryTree(rootPath, parent, depth)
  {
    depth = depth ? depth : 0;
    parent = parent ? parent : [];

    //var rep = "-".repeat(depth); console.log(rep + " " + rootPath);

    var dir = new Directory(rootPath);
    var dirEntries = dir.getEntriesSync();
    var hasMdFiles = false;
    dirEntries.forEach((itm, idx)=>{
      if(itm instanceof File)
      {
        var bn = itm.getBaseName();
        if(bn.match(/\.(md)$/))
        {
          parent.push({"type": "item", "id": itm.getPath(), "group": itm.getParent().getPath(),  "text": itm.getBaseName()});
          hasMdFiles = true;
        }
        //console.log(rep + " " + itm.getPath());
      }else {
        var cols = [];
        var possibleContainer = {"type": "container",
                    "id" : itm.getPath(),
                    "text": itm.getBaseName(),
                    "columns": cols,
                    "hideList": false};
        var hasSubTreeMdFile = this.walkDirectoryTree(itm.getPath(), cols, depth+1);
        if(hasSubTreeMdFile){
          parent.push(possibleContainer);
        }
        hasMdFiles = hasMdFiles || hasSubTreeMdFile;
      }
    });
    return hasMdFiles;
  }

  readExportfiles(){
    return;
    var paths = atom.project.getPaths();
    var pParent = [];

    this.files = { "Exportfiles": pParent, "ExportSelection": []};
    this.walkDirectoryTree(paths[0],pParent);
  }

}
