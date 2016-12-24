'use babel';

import {  File, Directory } from 'atom'
import Chokidar from 'chokidar'
import Glob from 'glob'
import path from 'path'
//import watchr from 'watchr'
import WatchHelper from '../Helper/WatchHelper'

var selfInstance;
export default class LinkUpdater
{
  constructor(subscriptions)
  {
    selfInstance = this;
    this.subscriptions = subscriptions;
    //this.findFilesToListenTo();
    //this.scanMDFiles();
  }

  scanMDFiles(text)
  {
    var t0 = performance.now();
    var globPattern = atom.config.get("MaPerWiki.AutomaticLinkUpdating.directoryGlobPattern");
    var onPathsSearched = function(numberOfPathsSearched){

      var t1 = performance.now();
      console.log(`Linksearch took ${t1 - t0}  milliseconds and ${numberOfPathsSearched} files were searched.`);
    };
    var retPromise = atom.workspace.scan(/Motivation/,{paths: globPattern/*this.files*/, onPathsSearched},function(result,err){
    var foundFile;
    if(foundFile = selfInstance.files.find( x => x.path == result.filePath)){
      var idxFoundFile = selfInstance.files.indexOf(foundFile);
      foundFile.matches = result.matches;
      var file = new File(foundFile.path);
      var fileDirectory = file.getParent().getPath();
      result.matches.forEach((itm,idx)=>{
        var ms = itm.matchText.match(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +(.*))?\)/);
        foundFile.matches[idx].regexMatch = ms;
        foundFile.matches[idx].absolutePath = path.resolve(fileDirectory, ms[2]);

        console.log(`found ${foundFile.path} Key(${ms[1]}) Link(${ms[2]}) Title(${ms[3]})`);
      });

      console.log(`found ${result.matches.length} in ${result.filePath}`);
    }

  });
  }


  findFilesToListenTo()
  {



    return;
    var paths = atom.project.getPaths();
    var ignoredPaths = atom.inDevMode() ? paths[0] + '\\@(node_modules)\\**\\*.*' : "";
    this.files = [];
    this.directories = [];

    Chokidar.watch(paths[0] + "\\**\\*.@(md)", {ignored: paths[0] + '\\@(node_modules)\\**\\*.*'}).on('all', (event, path) => {
      if(event == "add" && !selfInstance.files.find( x => x.path == path) )
      {
        var file = new File(path);
        selfInstance.files.push( { path:path, matches:[] } );
        /*
        var dir = file.getParent().getPath();
        if( selfInstance.directories.indexOf( dir ) == -1)
        {
          selfInstance.directories.push(dir);
        }
        */
      }
      console.log(event, path);

    });
  }
/*
  addWatchrListener()
  {
    var paths = atom.project.getPaths();
    watchr.watch({
        paths: paths,
        listeners: {
            log: function (logLevel) {
                //console.log('a log message occured:', arguments)
                var bp = "";
            },
            error: function (err) {
                //console.log('an error occured:', err)
                var bp = "";
            },
            watching: function (err, watcherInstance, isWatching){
                if (err) {
                    console.log("watching the path " + watcherInstance.path + " failed with error", err)
                } else {
                    console.log("watching the path " + watcherInstance.path + " completed")
                }
                var bp = "";
            },
            change: function(changeType, filePath, fileCurrentStat, filePreviousStat){
              console.log(`${filePath}: ${changeType} | ${fileCurrentStat} | ${filePreviousStat}`);

                //console.log('a change event occured:', arguments)
            }
        },
        next: function(err, watchers){
          /**
            if (err) {
                return console.log("watching everything failed with error", err)
            } else {
                console.log('watching everything completed', watchers)
            }

            // Close watchers after 60 seconds
            setTimeout(function () {
                console.log('Stop watching our paths')
                for ( var i = 0; i < watchers.length; i++ ) {
                    watchers[i].close()
                }
            }, 60 * 1000)
            * /
        }
    })
  }
  */




  findReferenceInfiles()
  {
    var wh = new WatchHelper();
    wh.onAdd((file)=>{
      console.log(`OnAdd: ${file.getPath()}`);
    });

    wh.onDelete((file)=>{
      console.log(`OnDelete: ${file.getPath()}`);
    });
    //this.addWatchrListener();
    //this.recursiveDirectoryListener(atom.project.getDirectories()[0]);




    return;
    var t0 = performance.now();
    var globPattern = atom.config.get("MaPerWiki.AutomaticLinkUpdating.directoryGlobPattern");
    var onPathsSearched = function(numberOfPathsSearched){

      var t1 = performance.now();
      console.log(`Linksearch took ${t1 - t0}  milliseconds and ${numberOfPathsSearched} files were searched.`);
    };
    // var d = ["C:/Users/karadas/github/MaPerWiki/a.b/*"];
    // ["**/*.@(md)"]
    var retPromise = atom.workspace.scan(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +(.*))?\)/,{paths: globPattern/*this.files*/, onPathsSearched},function(result,err){
      var foundFile;
      if(foundFile = selfInstance.files.find( x => x.path == result.filePath)){
        var idxFoundFile = selfInstance.files.indexOf(foundFile);
        foundFile.matches = result.matches;
        var file = new File(foundFile.path);
        var fileDirectory = file.getParent().getPath();
        result.matches.forEach((itm,idx)=>{
          var ms = itm.matchText.match(/!?\[(.*?)(?=\]\()\]\((.*?)(?: +(.*))?\)/);
          foundFile.matches[idx].regexMatch = ms;
          foundFile.matches[idx].absolutePath = path.resolve(fileDirectory, ms[2]);

          console.log(`found ${foundFile.path} Key(${ms[1]}) Link(${ms[2]}) Title(${ms[3]})`);
        });

        console.log(`found ${result.matches.length} in ${result.filePath}`);
      }

    });
  }

  replaceLinks()
  {

  }

}
