'use babel';

import {  File } from 'atom'
import path from 'path'
import { shell } from 'electron'

export default class JumpToWikiLink
{
  constructor()
  {

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

    let leftText;
    let rightText;

    try{
      leftText = leftPart.match(/\[(?=[^[]*$)[^(]*\((.*)/,'i')[1];//leftPart.substring(leftPart.lastIndexOf("(")+1,leftPart.length);
      rightText = rightPart.substring(0,rightPart.indexOf(")"));
    }catch(exception){}

    if(leftText !== undefined && rightText !== undefined)
    {
      let possibleFile = leftText + rightText;

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
        shell.openItem(realPath);
      }
    }

  }
}
