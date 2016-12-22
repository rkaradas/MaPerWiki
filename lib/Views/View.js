'use babel';

import fs from 'fs'
import path from 'path'

export default class View
{
  template = null;
  name = "";

  constructor()
  {
    if(this.constructor.name != "View"){
      name = this.constructor.name.replace(/View$/,"");

      this.template = document.createElement("span");
      this.template.innerHTML = fs.readFileSync(path.join(__dirname, "..//ViewTemplates/", name+".html"))
      //this.template = this.template.innerHTML;
    }
  }

  serialize()
  {

  }

  destroy()
  {
    this.template.remove();
  }

  getTemplateElement()
  {
    return this.template;
  }

}
