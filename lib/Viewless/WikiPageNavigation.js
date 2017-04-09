'use babel';

import {  File, Directory } from 'atom'
import path from 'path'
import fs from "fs"
import _ from "lodash"

export default class WikiPageNavigation
{


  constructor(eventHandler)
  {
    this.eventHandler = eventHandler;

    this.pageBackHistory = [];
    this.pageForwardHistory = [];
    this.current = "";

    atom.workspace.onDidStopChangingActivePaneItem((item)=>{
      this.setCurrentPage(item);
    });


    var aPane = atom.workspace.getActivePane();
    if(aPane.activeItem)
    {
      var possibleActiveTextEditor = aPane.activeItem;
      this.setCurrentPage(possibleActiveTextEditor);

    }
  }

  setCurrentPage(textEditor)
  {
    if(!atom.workspace.isTextEditor(textEditor))
      return;

    var currTEPath = textEditor.getPath();
    if(currTEPath && currTEPath.match(/\.(md)$/))
    {
      // prevent repeating the same item, if it's already added (when onDidChangeActiveItem fires)
      if(currTEPath != this.current)
      {
        if(this.current != "")
          this.pageBackHistory.unshift(this.current);

        console.log("active pane item changed: " + currTEPath);
        this.current = currTEPath;

        // if the newly added item equals the next forward history item,
        // perform a goForward, else clear the forward history.
        if(this.canGoForward() && this.pageForwardHistory[0] == this.current)
        {
          this.pageForwardHistory.shift();
        }
        else
        {
          this.pageForwardHistory = [];
        }
        this.eventHandler.navigationHistoryChange();
      }
    }

  }

  canGoForward()
  {
    return this.pageForwardHistory && this.pageForwardHistory.length > 0;
  }
  canGoBack()
  {
    return this.pageBackHistory && this.pageBackHistory.length > 0;
  }
  goPageForward()
  {

    console.log("go forward clicked: ");
    var bp = "bp";
    if(this.canGoForward())
    {
      this.pageBackHistory.unshift(this.current);
      this.current = this.pageForwardHistory.shift();
      this.navigateToCurrentPage();
    }
  }
  goPageBack()
  {
    console.log("go back clicked: ");
    if(this.canGoBack()){
      this.pageForwardHistory.unshift(this.current);
      this.current = this.pageBackHistory.shift();
      this.navigateToCurrentPage();
    }
  }

  navigateToCurrentPage()
  {
    console.log("navigateToCurrentPage: " + this.current);
    atom.workspace.open(this.current,{searchAllPanes: true}).then((editor)=>{
      this.eventHandler.navigationHistoryChange();
    });
  }
}
