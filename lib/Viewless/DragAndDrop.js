'use babel';
import {  File } from 'atom'
import _ from "lodash"

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
          var lastSelection = editor.getLastSelection();

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
            var isImage = file.getBaseName().match(/\.(jpg|jpeg|png|gif)$/);

            var linkStr = "[" + ( lastSelection.isEmpty() ? file.getBaseName() : lastSelection.getText() )+ "]("+initialPath+")";
            if(isImage)
              linkStr = "!" + linkStr;

            if(lastSelection.isEmpty())
            {

              if(confAction == "Copy to clipboard")
              {
                atom.clipboard.write(linkStr);

                atom.notifications.addSuccess("Successfully copied " + linkStr + " to the clipboard.");

              }else {
                editor.insertText(linkStr);
              }
            }else{
              lastSelection.insertText(linkStr);
            }
          }
        }
      });

    }));
  }


}
