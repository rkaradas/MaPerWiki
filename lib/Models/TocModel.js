"use babel"

export default class TocModel
{

  init()
  {
    this.width = 200;
    this.treeData =  {
      name: 'root',
      children: [
      ]
    }
    this.resizeHandleSize = 5;
    this.resizeMinSize = 100;
    this.showTree = true;
    this.resizerPosition = "left";
  }

  setResizerPosition(position)
  {
      this.resizerPosition = position;
  }

  updateData(editor, vueData)
  {
    var t0 = performance.now();
    if(!atom.workspace.isTextEditor(editor))
      return;

    var lineCount = editor.getLineCount();
    this.editor = editor;

    /*
      loop through all lines, check if its a H[1-6], and get the marker
      We need the marker to be able to scroll to the corresponding line, when the user clicks on a title within TOC
    */
    var tocAutoNumberHeadings = atom.config.get("MaPerWiki.TOC.tocAutoNumberHeadings");
    vueData.children = []; // clean the array
    //var newChildren = [];    this.treeData.children = [];    var parent = newChildren;
    for (var row = 0; row < lineCount; row++)
    {
      var lineText = editor.lineTextForBufferRow(row);
      lineText = lineText ? lineText.trim() : lineText;
      if(lineText){
        var header = lineText.match(/^(#{1,6}) +([^#]{1}[\S]{1}.*) */); // string must begin with # for 1 to 6 times
        if(header)
        {
          var headerCount = header[1].length;
          var headerText = header[2];

          var marker = editor.markBufferPosition([row, 0]);

          var markerId = marker.id
          //console.log(lineText + "HEADER: " +header);

          var possibleParent = vueData;//vueData;
          var counter = 0;
          var chapterNumber = "";
          while( counter < headerCount )
          {
            if(counter == (headerCount-1) // it's the same level, so we can push it in
              /*
                This part checks, if there are children available to dig into,
                It handles the possibility, that a heading was skipped, i.e. h4 after h2 instead of h3,
                so we have to push it into the last known parent, here into h2 because h3 doesn't exist.
              */
              || counter < (headerCount-1) && !Array.isArray(possibleParent.children)
              )
            {
              if(!Array.isArray(possibleParent.children)){
                possibleParent.children = [];
              }
              if(tocAutoNumberHeadings){
                var currNumber = (possibleParent.children.length + 1);

                chapterNumber += chapterNumber != "" ? ("." + currNumber) : currNumber;
              }
              possibleParent.children.push({type: 'file', name: chapterNumber + " " +headerText, markerId: markerId, "expanded": true, parent:possibleParent});

              // here we have to make sure, if the second part of the if-statement is true,
              // that we set the counter accordingly, so we exit the while-loop
              counter = headerCount;
            }else
            {
              // we need to check again if there is a child element available
              if(Array.isArray(possibleParent.children) && possibleParent.children.length > 0)
              {
                if(tocAutoNumberHeadings){
                  var currNumber = possibleParent.children.length;
                  chapterNumber += chapterNumber != "" ? ("." + currNumber) : currNumber;
                }
                possibleParent = possibleParent.children[possibleParent.children.length-1];
              }
            }
            counter++;
          }

        }

      }
    }

    var t1 = performance.now();
    console.log("Call to TocModel.updateData took " + (t1 - t0) + " milliseconds.")

    /*
    if(this.treeData.children.length > 0)
      vueData.children = this.treeData.children;
    */
  }




}
