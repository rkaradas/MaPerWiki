'use babel';

import {  File } from 'atom'
import path from 'path'
import { shell } from 'electron'
import Utils from '../Helper/Utils'

var selfInstance;
export default class JumpToWikiLink
{
  constructor()
  {
    selfInstance = this;
    this.utils = new Utils();


    atom.workspace.observeTextEditors((editor)=>{

        let keyevent = atom.config.get("MaPerWiki.JumpToWikiLink.clickToOpenWikiLinkWithKeyevent");
        let textEditorView = atom.views.getView(editor);
        textEditorView.addEventListener("click",(e)=>{
          let isClickToOpenWikiLink = atom.config.get("MaPerWiki.JumpToWikiLink.clickToOpenWikiLink");
          if(isClickToOpenWikiLink)
          {
            if(e.altKey == (keyevent == "alt")
              && e.metaKey  == (keyevent == "cmd")
              && e.ctrlKey  == (keyevent == "ctrl")
              && e.shiftKey == (keyevent == "shift")
            )
            {
              this.jumpToLinkUnderCursor();

            }
          }
        });


    });
  }

  getMarkdownLink(leftPart, rightPart)
  {
    let link;
    try{
      let leftText = leftPart.match(/\[(?=[^[]*$)(.*)/,'i')[0];//(/\[(?=[^[]*$)[^(]*\((.*)/,'i')[1];//leftPart.substring(leftPart.lastIndexOf("(")+1,leftPart.length);
      let rightText = rightPart.substring(0,rightPart.indexOf(")")) + ")";

      let possibleLink =leftText + rightText;
      let parsedLink = this.utils.tryParseMarkdownLink(possibleLink);

      if(parsedLink && parsedLink.length >= 2)
      {
        link = parsedLink[2];
      }
    }catch(exception){}

    return link;
  }

  getWikiTextLink(leftPart, rightPart)
  {
    let link;
    try{
      let leftText = leftPart.match(/\[\[(?=[^[]*$)(.*)/,'i')[0];
      let rightText = rightPart.substring(0,rightPart.indexOf("]]")) + "]]";


      let possibleLink =leftText + rightText;
      let parsedLink = this.utils.tryParseWikiTextLink(possibleLink);

      if(parsedLink)
      {
        link = parsedLink.text;
      }
    }catch(exception){}

    return link;
  }

  jumpToLinkUnderCursor()
  {
    let openNonMarkdownFilesInSystemsDefaultApp = atom.config.get("MaPerWiki.JumpToWikiLink.openNonMarkdownFilesInSystemsDefaultApp");

    let activeTextEditor = atom.workspace.getActiveTextEditor();
    let cursorPosition = activeTextEditor.getCursorBufferPosition();
    let buffer = activeTextEditor.getBuffer();

    let lineText = activeTextEditor.lineTextForBufferRow(cursorPosition.row);
    let leftPart = lineText.substring(0,cursorPosition.column);
    let rightPart = lineText.substring(cursorPosition.column,lineText.length);

    let possibleFile = this.getMarkdownLink(leftPart, rightPart);
    possibleFile = possibleFile?possibleFile:this.getWikiTextLink(leftPart, rightPart);

    if(possibleFile)
    {
      var activeTextEditorFile = new File(activeTextEditor.getPath());
      var fileDirectory = activeTextEditorFile.getParent().getPath();
      let file = new File(path.resolve(fileDirectory, possibleFile));
      let realPath = file.getRealPathSync();

      if(window.mpwShowOutput)
        console.log("[Debug] Jump to link: " + possibleFile);
      if(possibleFile.match(/\.(md)$/))
      {
        atom.workspace.open(realPath,{searchAllPanes: true});
      }
      else if(openNonMarkdownFilesInSystemsDefaultApp)
      {
        let webUrl = this.utils.tryParseWebUrl(possibleFile);
        // macos does not open urls with shell.openItem
        if(webUrl)
        {
          shell.openExternal(possibleFile);
        }
        else {
          shell.openItem(realPath);
        }

      }

    }

  }
}
