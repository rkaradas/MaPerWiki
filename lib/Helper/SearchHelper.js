'use babel';
import _ from "lodash"

var selfInstance;

export default class SearchHelper
{

    constructor()
    {
      selfInstance = this;
      this.globPattern = ["**/*.md","!**/node_modules/**"];
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
      }
      catch (e) {
        // statements to handle any exceptions

        callback(root, e);

      }
    }


    searchInWiki(data, callback) // callback, when search is finished
    {
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
          console.log(`Linksearch took ${t1 - t0}  milliseconds and ${numberOfPathsSearched} files were searched.`);
          callback(root); // call the callback to return the root results
        };

        var retPromise = atom.workspace.scan(regex,{paths: globPattern, onPathsSearched},function(result,err){
          var foundFile;

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

        });
      }catch(e){
        callback(root, e);

      }


    }

}
