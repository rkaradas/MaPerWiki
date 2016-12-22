'use babel';
import {  File } from 'atom'

export default class DragAndDrop
{
  constructor(subscriptions)
  {
    this.subscriptions = subscriptions;
    this.subscriptions.add(atom.workspace.observeTextEditors((editor)=>{
      var textEditorView = atom.views.getView(editor);
      textEditorView.addEventListener("drop",(e)=>{

        var isEnabled = atom.config.get("MaPerWiki.DragAndDrop.fromProjectToTextEditorEnabled");
        if(isEnabled){
          scope = editor.getRootScopeDescriptor();
          if (typeof e.preventDefault === "function") {
            //e.preventDefault();
          }

          if (typeof e.stopPropagation === "function") {
            //e.stopPropagation();
          }
          var entry = e.currentTarget;

          var initialPath = e.dataTransfer.getData("initialPath");
          var file = new File(initialPath,false);
          var confAction = atom.config.get("MaPerWiki.DragAndDrop.fromProjectToTextEditorAction");
          if(file.isFile()){
            if(confAction == "Copy to clipboard")
            {
              atom.clipboard.write("["+file.getBaseName()+"]("+initialPath+")");


              atom.notifications.addSuccess("Successfully copied ["+file.getBaseName()+"]("+initialPath+") to the clipboard.");

              var b1 = "b1";
            }else {
              editor.insertText("["+file.getBaseName()+"]("+initialPath+")");
            }
          }
        }
      });

    }));
  }


}
