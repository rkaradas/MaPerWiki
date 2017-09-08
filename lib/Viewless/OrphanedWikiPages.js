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

    var projectPaths = atom.project.getPaths();

    projectPaths.forEach((rootPath,idx)=>{
      this.findAllMarkdownFiles(rootPath, (projectMarkdownFiles)=>{
        this.findOrphanedFiles(()=>{
          this.markAllOrphanedLinks(rootPath, projectMarkdownFiles);
        });
      });
    });



  }

  tryMarkOrphanedLink(projectMarkdownFiles, item, wikiHomePath)
  {

    try{
      if(projectMarkdownFiles)
      {
        // check if itm is tree-view, by checking if the function 'entryForPath' is defined
        if(item.entryForPath)//if(itm.item.entryForPath) //
        {
          projectMarkdownFiles.forEach((fPath,pathIdx)=>{

            let curTEEntry = item.entryForPath(fPath);//itm.item.entryForPath(fPath);

            if(selfInstance.foundPathsInWikiLinks.indexOf(fPath) < 0 && fPath != wikiHomePath)
            {
              curTEEntry.classList.add('orphaned-WikiPage');
            }else{
              curTEEntry.classList.remove('orphaned-WikiPage');
            }
          });

        }

      }

    }catch(e){
      if(window.mpwShowOutput)
        console.log(e);

    }
  }

  markAllOrphanedLinks(rootPath, projectMarkdownFiles)
  {
    let leftPanels = atom.workspace.getLeftPanels();
    let treeViewPane = atom.workspace.paneForURI('atom://tree-view');

    let wikiFilePath = atom.config.get("MaPerWiki.WikiHome.filePath");
    //var projectPath = atom.project.getPaths();

      let joinedPath = path.join(rootPath, wikiFilePath);
      let normalizedFullWikiFilePath = path.normalize(joinedPath);
      leftPanels.forEach((itm, idx)=>{
        this.tryMarkOrphanedLink(projectMarkdownFiles, itm.item, normalizedFullWikiFilePath);

      });

      treeViewPane.items.forEach((itm, idx)=>{
        this.tryMarkOrphanedLink(projectMarkdownFiles, itm, normalizedFullWikiFilePath);

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

  findAllMarkdownFiles(rootPath, callback)
  {
    var projectMarkdownFiles = [];
    var files = Glob(rootPath + "/**/*.@(md)", { ignore: rootPath + '/@(node_modules)/**/*.*' }, function (er, files) {
      files.forEach((itm, idx)=>{
        var nPath = path.normalize(itm)
        projectMarkdownFiles.push(nPath);
      })
      if(callback)
        callback(projectMarkdownFiles);
    });
  }
}
