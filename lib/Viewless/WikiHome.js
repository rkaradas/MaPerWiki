'use babel';

import {  File, Directory } from 'atom'
import path from 'path'
import fs from "fs"
import _ from "lodash"

export default class WikiHome
{
  constructor()
  {

  }

  goHome()
  {
    var filePath = atom.config.get("MaPerWiki.WikiHome.filePath");
    //var fPath = path.resolve(rPath[0], rPath[1]);
    atom.workspace.open(filePath,{initialLine: 0, initialColumn: 0,searchAllPanes: true}).then((editor)=>{
      editor.save();
    });

  }
  setHome(filePath)
  {
    var rPath = atom.project.relativizePath(filePath);
    if(rPath[0] && rPath[1]){
      atom.config.set("MaPerWiki.WikiHome.filePath", rPath[1]);
      atom.notifications.addSuccess("Successfully added " + rPath[1] + " as your WikiHome file.");
    }else {
      if(!rPath[0] && rPath[1])
      {
        atom.notifications.addError("Couldn't set the file as WikiHome.",
        {
          detail: "It seems the file is outside your project folder.",
          dismissable: true
        });
      }
      else
      {
        atom.notifications.addError("Couldn't set the file as WikiHome.",
        {
          detail: "It seems you didn't save the file into your project folder.",
          dismissable: true
        });
      }
    }

  }
}
