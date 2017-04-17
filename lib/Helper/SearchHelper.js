'use babel';
import _ from "lodash"
import fs from "fs"

var selfInstance;

export default class SearchHelper
{

    constructor(eventHandler)
    {
      this.eventHandler = eventHandler;
      selfInstance = this;
      this.globPattern = ["**/*.md","!**/node_modules/**"];
      this.currentSearchPromise;
    }

    buildRegEx(data,isRegEx)
    {
      var flags = "mg";
      if(!data.isCaseSensitive) flags += "i"; // i= ignore CaseSensitive, g=global (all matches), m=multiline
      var searchTerm = isRegEx ? data.searchTerm : _.escapeRegExp(data.searchTerm);
      var regexSearchTerm = data.isWholeWord ? "\\b" + searchTerm + "\\b" : searchTerm;
      var regex = new RegExp(regexSearchTerm, flags);
      return regex;
    }

    search(data, callback)
    {
      this.eventHandler.searchInProgress();
      var activeTextEditor = atom.workspace.getActiveTextEditor();
      var root;


      try {

        var regex = this.buildRegEx(data, data.isRegEx);

        // This represents the Search term and (nr of hits/nr of files)
        root = {
          searchTerm: data.searchTerm,
          fileEntries: [],
          nrOfFiles: 1,
          nrOfResults: 0,
          showFileEntries: true,
          isRegEx: data.isRegEx,
          isCaseSensitive: data.isCaseSensitive,
          isWholeWord: data.isWholeWord
        };
        if(activeTextEditor)
        {

          root.fileEntries.push({
            filePath: activeTextEditor.getPath(),
            entries: [],
            nrOfResults: 0,
            showEntries: true
          });

          activeTextEditor.scan(regex,(resultObj)=>{
            var match = resultObj.match;
            root.nrOfResults++;
            root.fileEntries[0].nrOfResults = root.nrOfResults;

            root.fileEntries[0].entries.push({
              name: resultObj.lineText,
              range: resultObj.range,
              filePath: activeTextEditor.getPath(),
              lineTextOffset: resultObj.lineTextOffset
            });

          });

        }
        callback(root);
        this.eventHandler.searchCompleted();
      }
      catch (e) {
        // statements to handle any exceptions

        callback(root, e);
        this.eventHandler.searchCompleted();

      }
    }


    searchInWiki(data, callback,callbackEntry) // callback, when search is finished
    {
      this.eventHandler.searchInProgress();
      var root;
      try{

        var regex = this.buildRegEx(data, data.isRegEx);
        var globPattern = selfInstance.globPattern; //atom.config.get("MaPerWiki.AutomaticLinkUpdating.directoryGlobPattern");


        // This represents the Search term and (nr of hits/nr of files)
        root = {
          searchTerm: data.searchTerm,
          fileEntries: [],
          nrOfFiles: 0,
          nrOfResults: 0,
          showFileEntries: true,
          isRegEx: data.isRegEx,
          isCaseSensitive: data.isCaseSensitive,
          isWholeWord: data.isWholeWord
        };

        var t0 = performance.now();
        var onPathsSearched = function(numberOfPathsSearched){

          var t1 = performance.now();
          if(window.mpwShowOutput)
            console.log(`SearchHelper took ${t1 - t0}  milliseconds and ${numberOfPathsSearched} files were searched.`);
          //callback(root); // call the callback to return the root results
        };
        var cnt = 0;
        var followSymLinks = atom.config.get("MaPerWiki.WikiSearch.followSymLinks");

        this.currentSearchPromise = atom.workspace.scan(regex,{paths: globPattern, onPathsSearched},function(result,err){
          var foundFile;
          var foundFileStat = fs.lstatSync(result.filePath);

          if(!followSymLinks && foundFileStat.isSymbolicLink())
            return;

          root.nrOfFiles++; // increment nr of files
          root.fileEntries.push({
            filePath: result.filePath,
            entries: [],
            nrOfResults: 0,
            showEntries: true
          });

          var fileEntryIdx = root.fileEntries.length - 1;
          result.matches.forEach((itm, idx)=>{
            root.nrOfResults++;
            root.fileEntries[fileEntryIdx].nrOfResults++;
            root.fileEntries[fileEntryIdx].entries.push({
              name: itm.lineText,
              range: itm.range,
              filePath: result.filePath,
              lineTextOffset: itm.lineTextOffset
            });
          });
          callbackEntry(root,cnt == 0,this.currentSearchPromise);
          cnt++;

        });

        this.currentSearchPromise.then(()=>{
            //callback(root); // call the callback to return the root results
            this.eventHandler.searchCompleted();
        });
      }catch(e){
        callback(root, e);
        this.eventHandler.searchCompleted();

      }


    }

}
