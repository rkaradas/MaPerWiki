"use babel";

import {  File, Directory } from 'atom'
import path from 'path'
import fs from "fs"
import _ from "lodash"
import Glob from 'glob'

var selfInstance;
export default class LinkCheckerModel
{
  constructor()
  {
    selfInstance = this;
    this.init();
    this.interval = 5 * 60 * 1000; // 5 minutes
    //this.intervalReference = this.updateSaveInterval(this.interval);
    /*
      We should use timeout instead of interval, because interval executes
      every x milliseconds, so the function calls could overlap.
      Here we call setTimeout again, after all links were checked.
    */
    setTimeout(()=> this.findReferenceInfiles(), this.interval);
  }
  init()
  {
    this.globPattern = ["**/*.md","!**/node_modules/**"];
    this.searchTerm = "";
    this.testVar = "";
    this.width = 400;
    this.height = 400;
    this.resizeHandleSize = 5;
    this.resizeMinSize = 100;

    this.results = [];

    this.nrOfBrokenLinks = 0;
    this.nrOfFilesWithBrokenLinks = 0;
    this.isBusy = false;
  }

  createNewFile(brokenLink){
    var newFile = new File(brokenLink.linkFilePath);
    newFile.create().then((fulfilled, rejected)=>{
      if(fulfilled)
      {
        brokenLink.show = false;
        this.nrOfBrokenLinks--;
        this.findReferenceInfiles(); // check again for broken links
        atom.notifications.addSuccess("Successfully created " + brokenLink.linkFilePath );
      }else{
        atom.notifications.addError("Couldn't create " + brokenLink.linkFilePath + ". It seems, that the File already exists.");
      }
    });
  }

  linkTo(brokenLink, alternativeLink, result){
    //this.model.linkTo(brokenLink, alternativeLink);
    var bl = brokenLink;
    var al = alternativeLink;
    var activeTextEditor = atom.workspace.getActiveTextEditor();
    if(activeTextEditor)
    {
      var relativePathTo = path.relative(brokenLink.fileDirectory, alternativeLink);
      var newText = brokenLink.textMatch.replace(brokenLink.link, relativePathTo);
      activeTextEditor.getLastSelection().insertText(newText,{select: true}); // select newly added text
      brokenLink.show = false;
      this.nrOfBrokenLinks--;
       // if broken file (result) has only one child, then we also hide the broken file entry.
      if(result.brokenLinks.length == 1){
        result.show = false;
        this.nrOfFilesWithBrokenLinks--;
      }
      this.findReferenceInfiles(); // check again for broken links
      atom.notifications.addSuccess("Successfully linked to " + alternativeLink );
    }else{
      atom.notifications.addError("Couldn't link to " + alternativeLink + ". Please try again.");
    }
  }


  findReferenceInfiles()
  {
    this.isBusy = true;
    var t0 = performance.now();
    var globPattern = this.globPattern; //atom.config.get("MaPerWiki.AutomaticLinkUpdating.directoryGlobPattern");
    var nrOfBrokenLinksTmp = 0;
    var nrOfFilesWithBrokenLinksTmp = 0;
    var resultsTmp = [];

    var onPathsSearched = function(numberOfPathsSearched){

      var t1 = performance.now();
      console.log(`Linksearch took ${t1 - t0}  milliseconds and ${numberOfPathsSearched} files were searched.`);
      selfInstance.results = resultsTmp;
      setTimeout(()=> selfInstance.findReferenceInfiles(), selfInstance.interval);
    };
    // var d = ["C:/Users/karadas/github/MaPerWiki/a.b/*"];
    // ["**/*.@(md)"]
    this.findMarkdwonFilesInProject();
    var retPromise = atom.workspace.scan(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +"(.*)")?\)/g,{paths: globPattern/*this.files*/, onPathsSearched},function(result,err){
      var foundFile = result.filePath;
      var foundBrokenLinkInFile = false;


      /*
      console.log("");
      console.log(foundFile);
      */
      var file = new File(foundFile);
      var fileDirectory = file.getParent().getPath();

      var brokenFile = {filePath: foundFile, fileDirectory: fileDirectory, brokenLinks: [], show: true};

      result.matches.forEach((itm,idx)=>{
        var ms = itm.matchText.match(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +"(.*)")?\)/);
        var regexMatch = ms;
        var absolutePathOfLinksLink = path.resolve(fileDirectory, ms[2]);
        var linkOfLinkExists = fs.existsSync(absolutePathOfLinksLink);

        // check if is url
        var mIsUrl = ms[2].match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);

        if(!linkOfLinkExists && !mIsUrl) {

          var brokenLink = {
            filePath: foundFile,
            fileDirectory: fileDirectory,
            linkFilePath: absolutePathOfLinksLink,
            alternativeLinks: [],
            textMatch: ms[0],
            linkText: ms[1],
            link: ms[2],
            linkTitle: ms[3],
            range: itm.range,
            show: true,
            isImage: absolutePathOfLinksLink.match(/\.(jpg|jpeg|png|gif)$/)
          };
          var fName = path.parse(brokenLink.link);
          var foundFileArray;
          if(foundFileArray = selfInstance.projectMarkdownFiles.find( x => x.fileName == fName.base))
          {
            brokenLink.alternativeLinks = foundFileArray.paths;
          }

          brokenFile.brokenLinks.push(brokenLink);

          nrOfBrokenLinksTmp++;
          if(!foundBrokenLinkInFile){
            nrOfFilesWithBrokenLinksTmp++;
          }
          foundBrokenLinkInFile = true;
        }

        //console.log(`${!linkOfLinkExists?'NOT':''} found ${absolutePathOfLinksLink}  Key(${ms[1]}) Link(${ms[2]}) Title(${ms[3]})`);
      });
      if(foundBrokenLinkInFile){
        resultsTmp.push(brokenFile);
        //selfInstance.results.push(brokenFile);
      }

      //console.log("");

    }).then(()=>{
      this.nrOfBrokenLinks = nrOfBrokenLinksTmp;
      this.nrOfFilesWithBrokenLinks = nrOfFilesWithBrokenLinksTmp;

      this.isBusy = false;
    });
  }

  findMarkdwonFilesInProject()
  {

    var paths = atom.project.getPaths();

    var filePaths = [];
    var filesArray = [];
    var files = Glob.sync(paths[0] + "\\**\\*.@(md|jpg|jpeg|png|gif)", { ignore: paths[0] + '\\@(node_modules)\\**\\*.*' });

    //, function (er, files) {
    files.forEach((itm, idx)=>{
      var test = itm;
      var pathInfo = path.parse(itm);
      var foundFile;
      if(foundFile = filesArray.find( x => x.fileName == pathInfo.base))
      {
        foundFile.paths.push(itm);
      }else{
        filesArray.push({fileName: pathInfo.base, paths: [itm]});
      }
    });
    //});
    selfInstance.projectMarkdownFiles = filesArray;
  }

}