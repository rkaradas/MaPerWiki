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
      this.closeTabs();


    });

    var aPane = atom.workspace.getActivePane();
    if(aPane.activeItem)
    {
      var possibleActiveTextEditor = aPane.activeItem;
      this.setCurrentPage(possibleActiveTextEditor);

    }
  }


  findAndDestroyCandidate(tabsArr,tes, itm)
  {
    var saveAndDestroy = atom.config.get("MaPerWiki.WikiPageNavigation.saveAndDestroy");
    if(tabsArr.indexOf(itm) == -1) // if it's not in "keepOpenTabs array"
    {
      var textEditor = tes.find((te)=>te.getPath()==itm);
      if(textEditor && ( !textEditor.isModified() || saveAndDestroy)) // if it's not modified or saveAndDestroy
      {
        if(saveAndDestroy)
        {
          textEditor.onDidSave(()=>{
            if(window.mpwShowOutput)
              console.log("[Saved and destroyed] " + itm);
            textEditor.destroy();
          });
          var teAlive = textEditor.isAlive();
          if(teAlive) // make sure, that the texteditor wasn't destroyed before...
            textEditor.save();
        }else{
          if(window.mpwShowOutput)
            console.log("[Destroyed] " + itm);
          textEditor.destroy();
        }

      }

    }
  }
  closeTabs()
  {
    if(window.mpwShowOutput)
    {
      console.log("BACK");
      this.pageBackHistory.forEach((itm,idx)=>{

        console.log(itm);
      });
      console.log("FORWARD");
      this.pageForwardHistory.forEach((itm,idx)=>{
        console.log(itm);
      });
    }


    var showMaxTabs = atom.config.get("MaPerWiki.WikiPageNavigation.showMaxTabs");
    if( showMaxTabs > 0 ) // showmaxtabs must be greater than 1, because the current tab "somehow" has to stay opened ;)
    {
      var textEditors = atom.workspace.getTextEditors();
      var keepOpenTabs = [];
      // put in the current tab
      keepOpenTabs.push(this.current);
      showMaxTabs--;

      // if showMaxTabs is greater than the length of back and forward history
      // we have to do nothing
      if(showMaxTabs < this.pageBackHistory.length + this.pageForwardHistory.length ){
        var backIdx = 0;
        var forwardIdx = 0;
        // first we have to gather items that should stay open
        // by walking the back history (descending) and the forward history (ascending)
        // for each loop we get one item from back and one from forward history (if the item not already in keepOpenTabs array)
        while(showMaxTabs && (backIdx < this.pageBackHistory.length || forwardIdx < this.pageForwardHistory.length) )
        {
          if(backIdx < this.pageBackHistory.length)
          {
            var backItm = this.pageBackHistory[backIdx];
            if(keepOpenTabs.indexOf(backItm) == -1) // if it's not already in "keepOpenTabs array"
            {
              var textEditor = textEditors.find((te)=>te.getPath()==backItm);
              if(textEditor) // we need the TE to keep it open ;)
              {
                keepOpenTabs.push(backItm);
                showMaxTabs--;
              }
            }
            backIdx++;
          }

          if(forwardIdx < this.pageForwardHistory.length)
          {
            var forwardItm = this.pageForwardHistory[forwardIdx];
            if(keepOpenTabs.indexOf(forwardItm) == -1) // if it's not already in "keepOpenTabs array"
            {
              var textEditor = textEditors.find((te)=>te.getPath()==forwardItm);
              if(textEditor) // we need the TE to keep it open ;)
              {
                keepOpenTabs.push(forwardItm);
                showMaxTabs--;
              }
            }
            forwardIdx++;
          }
        }

        // if showMaxTabs = 0 => we have collected our pages, so we can close the remaining
        if(showMaxTabs == 0)
        {
          // Next we loop through the back and forward array to close the remaining items
          // (if they are not modified, so the user does not loose unsaved work)
          for(var i=backIdx; i < this.pageBackHistory.length; i++)
          {
            this.findAndDestroyCandidate(keepOpenTabs, textEditors, this.pageBackHistory[i]);
          }
          for(var i=forwardIdx; i < this.pageForwardHistory.length; i++)
          {
            this.findAndDestroyCandidate(keepOpenTabs, textEditors, this.pageForwardHistory[i]);
          }
        }

      }


      return;
      var teToClose = [];

      if(showMaxTabs < this.pageBackHistory.length + this.pageForwardHistory.length + 1){// + 1 for the current tab
        if(this.pageBackHistory.length > 2)
        {
          for(var i = 0;i<this.pageBackHistory.length -2;i++)
          {
            teToClose.push(this.pageBackHistory[i]);
          }
        }
        if(this.pageForwardHistory.length > 2)
        {
          for(var i=2;i<this.pageForwardHistory.length;i++)
          {
            teToClose.push(this.pageBackHistory[i]);
          }
        }

        if(teToClose.length > 0)
        {
          var textEditors = atom.workspace.getTextEditors();
          textEditors.forEach((itm,idx)=>{
            if(teToClose.indexOf(itm.getPath()) != -1)
            {
              itm.destroy();
            }
          });
        }
      }


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
        if(window.mpwShowOutput)
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
    if(window.mpwShowOutput)
      console.log("go forward clicked: ");
    this.cleanNotExistingPages();
    if(this.canGoForward())
    {
      this.pageBackHistory.unshift(this.current);
      this.current = this.pageForwardHistory.shift();
      this.cleanNotExistingPages(); // this handles the case, if the "previous" current item was deleted => remove from arrays
      this.navigateToCurrentPage();
    }
  }
  goPageBack()
  {
    if(window.mpwShowOutput)
      console.log("go back clicked: ");
    this.cleanNotExistingPages();
    if(this.canGoBack()){
      this.pageForwardHistory.unshift(this.current);
      this.current = this.pageBackHistory.shift();
      this.cleanNotExistingPages(); // this handles the case, if the "previous" current item was deleted => remove from arrays
      this.navigateToCurrentPage();
    }
  }

  navigateToCurrentPage()
  {
    if(window.mpwShowOutput)
      console.log("navigateToCurrentPage: " + this.current);
    atom.workspace.open(this.current,{searchAllPanes: true}).then((editor)=>{
      this.eventHandler.navigationHistoryChange();

    });
  }

  cleanNotExistingPages()
  {
    this.cleanArray(this.pageForwardHistory);
    this.cleanArray(this.pageBackHistory);
  }
  cleanArray(arr)
  {
    var i = arr.length;
    while (i--) {
      var currFilepath = arr[i];
      if(!fs.existsSync(currFilepath))
      {
          arr.splice(i,1);
      }
    }
  }
}
