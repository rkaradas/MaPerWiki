'use babel';

import {  File, Directory } from 'atom'
import path from 'path'
import fs from "fs"
import _ from "lodash"
import Glob from "glob"

var selfInstance;
export default class OrphanedWikiPages
{

  constructor()
  {
    selfInstance = this;
    // holds all markdown files within the current project
    this.projectMarkdownFiles;
    this.foundPathsInWikiLinks;
    this.globPattern = ["**/*.md","!**/node_modules/**"];
  }

  /*  Steps
      1. Get all markdown files in tree into an array
      2. Scan all WikiLinks in all md files
      3. If WikiLink matches file in array => remove entry from array (note: WikiLink could be absolute or relative. If the latter, then get absolute path)
      4. Get tree view entry for each remaining array entry and add "orphaned-WikiPage" css class

  */
  check()
  {
    selfInstance.foundPathsInWikiLinks = [];

    this.findAllMarkdownFiles(()=>{
      this.findOrphanedFiles(()=>{
        this.markAllOrphanedLinks();
      });
    });



  }

  markAllOrphanedLinks()
  {
    var leftPanels = atom.workspace.getLeftPanels();
    leftPanels.forEach((itm, idx)=>{
      var editor = atom.workspace.getActiveTextEditor();
      try{
        if(selfInstance.projectMarkdownFiles)
        {
          // check if itm is tree-view, by checking if the function 'entryForPath' is defined
          if(itm.item.entryForPath) //
          {
            selfInstance.projectMarkdownFiles.forEach((path,pathIdx)=>{
              var curEditorPath = editor.getPath();
              var curTEEntry2 = itm.item.entryForPath(curEditorPath);

              var curTEEntry = itm.item.entryForPath(path);
              if(selfInstance.foundPathsInWikiLinks.indexOf(path) < 0 )
              {
                curTEEntry.classList.add('orphaned-WikiPage');
              }else{
                curTEEntry.classList.remove('orphaned-WikiPage');
              }
            });

            /*
            var curTEEntry = itm.item.entryForPath(editor.getPath());
            curTEEntry.classList.add('orphaned-WikiPage');
            var paths = atom.workspace.project.getPaths();
            var dirs = atom.workspace.project.getDirectories();
            var bp = "bp1";
            */
          }

        }

      }catch(e){
        console.log(e);

      }


    });
  }

  findOrphanedFiles(callback)
  {

    var globPattern = selfInstance.globPattern;

    var onPathsSearched = function(numberOfPathsSearched){
      if(callback)
        callback();
    };

    var retPromise = atom.workspace.scan(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +"(.*)")?\)/g,{paths: globPattern, onPathsSearched},function(result,err){
      // current file
      var foundFile = result.filePath;
      var file = new File(foundFile);

      // parent directory of current file
      var fileDirectory = file.getParent().getPath();

      // loop through all WikiLink matches
      result.matches.forEach((itm,idx)=>{
        var ms = itm.matchText.match(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +"(.*)")?\)/);
        var regexMatch = ms;
        var absolutePathOfLinksLink = path.resolve(fileDirectory, ms[2]);
        var linkOfLinkExists = fs.existsSync(absolutePathOfLinksLink);

        // If the WikiLink exists in the file system, remove it from the array of all project files
        if(linkOfLinkExists)
        {
          selfInstance.foundPathsInWikiLinks.push(absolutePathOfLinksLink);
        }

      });
    });
  }

  findAllMarkdownFiles(callback)
  {
    var paths = atom.project.getPaths();
    selfInstance.projectMarkdownFiles = [];
    var files = Glob(paths[0] + "/**/*.@(md)", { ignore: paths[0] + '/@(node_modules)/**/*.*' }, function (er, files) {
      files.forEach((itm, idx)=>{
        var nPath = path.normalize(itm)
        selfInstance.projectMarkdownFiles.push(nPath);
      })
      if(callback)
        callback();
    });
  }
}
