'use babel';
import {  File } from 'atom'
import path from 'path'
import Glob from 'glob'

var selfInstance;
class AutocompleteWikiLink {

	constructor() {
    selfInstance = this;
		// offer suggestions when editing markdown file type
		this.selector = '*';
		// make these suggestions appear above default suggestions
		this.suggestionPriority = 2;

    //this.initSuggestions();
    atom.workspace.onDidChangeActiveTextEditor((editor)=>{
      this.initSuggestions(editor)
    });
	}

  initSuggestions(editor)
  {
    if(editor === undefined) return;

    let paths = atom.project.getPaths();
    this.suggestions = [];
    let files = Glob.sync(paths[0] + "/**/*.@(md)", { ignore: paths[0] + '/@(node_modules)/**/*.*' });

    files.forEach((itm, idx)=>{

      let editorFile = new File(editor.getPath());
      let editorFileDirectory = editorFile.getParent().getPath();
      let relativePathTo = path.relative(editorFileDirectory, itm);
      selfInstance.suggestions.push(relativePathTo);
    });
  }

	getSuggestions(options) {
    if(!this.suggestions)
      this.initSuggestions(atom.workspace.getActiveTextEditor());

    let pref = this.getPrefix(options.editor, options.bufferPosition);
    if(window.mpwShowOutput && pref)
      console.log("AutocompleteWikiLink found prefix: " + pref);
    return !pref?[]:this.findMatchingSuggestions(pref);
    //return this.findMatchingSuggestions(prefix);
	}

  getPrefix(editor, bufferPosition)
  {
    let regex = /\[(?=[^[]*$)[^(]*\((.*)/;
    let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    let match = line.match(regex,'i');
    return match?match[1]:'';
  }

	findMatchingSuggestions(prefix) {
		// filter list of words to those with a matching prefix
		let matchingWords = this.suggestions.filter((suggestion) => {
			return suggestion.includes(prefix);
		});
		// convert the array of words into an array of objects with a text property
		let matchingSuggestions = matchingWords.map((word) => {
			return { text: word, iconHTML: '<i class="icon-file"></i>' };
		});


		return matchingSuggestions;
	}

}
export default new AutocompleteWikiLink();
