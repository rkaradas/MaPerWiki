"use babel";
import Vue from "vue";
import VueResizeHandle from "vue-resize-handle/unidirectional";
import {Project, Directory, File} from 'atom'
import Glob from 'glob'
import Sortable from 'vue-sortable'
import PandocHelper from '../Helper/PandocHelper'
import CalibreHelper from '../Helper/CalibreHelper'
import CustomUserExportHelper from '../Helper/CustomUserExportHelper'
import fs from 'fs'
import path from 'path'
import Concat from 'concat'
import TextEditorVue from '../VueComponents/small-text-editor'
import VueDragAndDropList from "vue-drag-and-drop-list";
import ListItem from "../VueComponents/list.js";

var selfInstance;
export default class ExportController
{

  Init()
  {
    Vue.use(VueDragAndDropList);
    this.vue = new Vue({
      el: this.domElement,
      components: {
        "resizer" : VueResizeHandle,
        "small-text-editor" : TextEditorVue,
        "list" : ListItem
      },
      data: this.viewModel,
      methods: {
        droppedOnDropzone: (evt)=>{
          var rootPath = evt.dataTransfer.getData("from-root-path");
          var initialPath = evt.dataTransfer.getData("initialPath");
          initialPath = initialPath?initialPath:rootPath;

          if(initialPath){
            var isDir = fs.lstatSync(initialPath).isDirectory();
            if(isDir)
            {
              selfInstance.viewModel.model.addFolderToExportSelectionRoot(initialPath)
            }
            else
            {
              var fileItm = new File(initialPath,false);
              selfInstance.viewModel.model.addFileToExportSelectionRoot(fileItm);
            }
          }
        },
        openSaveDialog: ()=>{
          var remote = require("remote");
          var dialog = remote.dialog;

          dialog.showSaveDialog({title:"MaPerWiki export filepath", defaultPath: selfInstance.viewModel.model.saveAs},(filepath)=>{
            if(filepath)
              selfInstance.viewModel.model.saveAs = filepath;
          });
        },
        close: () => this.viewModel.onClose(),
        readExportfiles: ()=> selfInstance.readExportfiles(),
        testfkt: ()=>{
          var arr = selfInstance.viewModel.model.getExportFiles();
          var bp = "a";

        },
        export:function(e)
        {
          this.model.isExportInProgress = true;
          var pandocHelper = new PandocHelper();
          var calibreHelper = new CalibreHelper();
          var customUserExportHelper = new CustomUserExportHelper();
          var arr = selfInstance.viewModel.model.getExportFiles();
          if(!arr || arr.length <=0)
          {
            atom.notifications.addError("Please drag and drop from Exportfiles to ExportSelection first.");

            this.model.isExportInProgress = false;
            return;
          }
          pandocHelper.files = arr;

          var fn = this.model.saveAs.trim();
          var f = new File(fn);
          var d = f.getParent().getPath();

          // Just pandoc
          if (this.model.toFormat == "markdown" || this.model.toFormat == "html"
                      || this.model.toFormat == "markdown_github" || this.model.toFormat == "docx") {
            pandocHelper.convert(this.model.saveAs.trim(), this.model.pandocArgs
              , this.model.fromFormat
              , this.model.toFormat, d,
              (pdErr)=>
              {
                this.model.isExportInProgress = false;
                if(pdErr)
                  atom.notifications.addError("Error",{detail: pdErr.message, stack: pdErr.stack, dismissable: true});
              }
            );
          }
          // Use pandoc to create a single file.
          // if epub, mobi or pdf, convert the single file with calibre
          // else use the custom user export arguments
          else {
            var tempMd = path.join(d, "cl--temp.md");
            Concat(arr, tempMd).then(
              (text)=>

              //pandocHelper.convert(tempMd,"", this.model.fromFormat, this.model.fromFormat ,(pdErr)=>
              {
                if(this.model.toFormat == "epub" || this.model.toFormat == "mobi" || this.model.toFormat == "pdf" )
                {
                  calibreHelper.convert(tempMd, fn, d,(cErr)=>{

                    fs.unlinkSync(tempMd);
                    this.model.isExportInProgress = false;
                    if(cErr)
                      atom.notifications.addError("Error",{detail: cErr.message, stack: cErr.stack, dismissable: true});
                  });
                }
                else {
                  var customUserExportItm;
                  if(customUserExportItm = this.model.customUserExports.find(x=>x.exportName == this.model.toFormat))
                  {
                    // perform export
                    var cmd  = customUserExportItm.exportValue.split("%1").join(tempMd);
                    cmd  = cmd.split("%2").join(fn);
                    customUserExportHelper.convert(cmd, d,(cueErr)=>{
                      fs.unlinkSync(tempMd);
                      this.model.isExportInProgress = false;
                      if(cueErr)
                        atom.notifications.addError("Error",{detail: cueErr.message, stack: cueErr.stack, dismissable: true});

                    });
                  }
                }
            }).catch((err)=>{
              if(fs.existsSync(tempMd))
                fs.unlinkSync(tempMd);
              this.model.isExportInProgress = false;
              atom.notifications.addError("Error",{detail: err.message, stack: err.stack, dismissable: true});
            });
            /**/
          }
        },
        // dragging ended
        onEnd: function (/**Event*/evt) {
            this.model.files.splice(evt.newIndex, 0,
              this.model.files.splice(evt.oldIndex, 1)[0]);
        },
        changeExtension: function(e)
        {
          selfInstance.determineAndChangeExtension();
        },
        changeSelected: (file,e) => file.selected = !(file.selected),
        toggleDisable() {
          this.model.disable = !this.model.disable;
        },
        copied(index){
          index.id++;
        },
        inserted(data){
          if(window.mpwShowOutput)
            console.log(data);
        },
        // Export config methods
        toggleExportConfig()
        {
          this.model.showExportConfig = !this.model.showExportConfig;
          this.model.loadCustomUserExports();
        },
        saveCustomUserExports()
        {
          this.model.saveCustomUserExports();
          this.model.showExportConfig = false;
          selfInstance.determineAndChangeExtension();
        },
        removeCustomUserExport(customUserExport)
        {
          var idxOfFileEntry;
          if( (idxOfFileEntry = this.model.customUserExports.indexOf(customUserExport)) != -1 )
          {
            this.model.customUserExports.splice(idxOfFileEntry, 1);
          }
        },
        addNewCustomUserExport()
        {
          this.model.customUserExports.push({exportName: "", exportValue: ""});
        }

      }
    });
  }

  constructor(view, viewModel)
  {
    selfInstance = this;
    this.view = view;
    this.domElement = this.view.getTemplateElement();
    this.viewModel = viewModel;

    var t0 = performance.now();
    this.Init();
    var t1 = performance.now();
    if(window.mpwShowOutput)
      console.log("Call to ExportController.constructor took " + (t1 - t0) + " milliseconds.");
    var paths = atom.project.getPaths();
    this.viewModel.model.saveAs = path.join(paths[0], "document" + this.determineExtension());
    this.viewModel.model.loadCustomUserExports();

  }
  determineAndChangeExtension()
  {
    if(this.viewModel.model.saveAs){
      this.viewModel.model.saveAs = this.viewModel.model.saveAs.substr(0, this.viewModel.model.saveAs.lastIndexOf(".")) + this.determineExtension();
    }
  }

  readExportfiles()
  {
      selfInstance.viewModel.model.readExportfiles();
      return;
      this.viewModel.model.saveAs = path.join(paths[0], "document" + this.determineExtension());

      var filePaths = [];
      // options is optional
      //*Glob("**/*.js"
      this.viewModel.model.files = [];
      //Glob(paths[0] + "\\**\\*.@(md|pdf)", { ignore: paths[0] + '\\@(node_modules|a\.b)\\**\\*.*' }, function (er, files) {
      Glob(paths[0] + "/**/*.@(md)", { ignore: paths[0] + '/@(node_modules)/**/*.*' }, function (er, files) {
        files.forEach((itm, idx)=>{
          selfInstance.viewModel.model.files.push({'id':idx, selected: true, 'path':itm});
        });
      });
  }

  determineExtension()
  {
    switch (this.viewModel.model.toFormat)
    {
       case "markdown":
       case "markdown_github": return ".md";
       case "docx": return ".docx";
       case "epub": return ".epub";
       case "mobi": return ".mobi";
       case "pdf": return ".pdf";
       case "html": return ".html";
       default: return this.determineExtensionOfCustomUserExport();
    }
  }
  determineExtensionOfCustomUserExport()
  {
    var returnExt = ".txt";
    var customUserExportItm;
    if(customUserExportItm = this.viewModel.model.customUserExports.find(x=>x.exportName == this.viewModel.model.toFormat))
    {
      if(customUserExportItm.exportExtension && customUserExportItm.exportExtension.trim() != "")
      {
        returnExt = customUserExportItm.exportExtension.trim();
        returnExt = returnExt[0]=="."?returnExt:"."+returnExt;
      }
    }
    return returnExt;
  }
  dispose(){
    this.view.destroy();
  }


}
