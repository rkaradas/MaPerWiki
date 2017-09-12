'use babel';
import {  File } from 'atom'
import path from 'path'
import Glob from 'glob'
import Utils from '../Helper/Utils'

var selfInstance;
class AutocompleteWikiLink {

	constructor() {
    selfInstance = this;
		this.utils = new Utils();
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


	  let autocompleteAllProjectFiles = atom.config.get("MaPerWiki.AutocompleteWikiLink.autocompleteAllProjectFiles");
		let filter = autocompleteAllProjectFiles?"/**/*.*":"/**/*.@(md)";
    let files = Glob.sync(paths[0] + filter, { ignore: paths[0] + '/@(node_modules)/**/*.*' });

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
    let regex = /\[(?=[^[]*$)[^(]*\((.*)/; // markdown syntax
    let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    let match = line.match(regex,'i');
		let prefix = '';
		if(!match)
		{
			let wikiTextMatch = line.match(/\[\[(?=[^[]*$)([^|]*)\|?(.*)/,'i'); // if no markdown match => try wikitext
			if(wikiTextMatch)
				prefix = wikiTextMatch[2]? wikiTextMatch[2] : wikiTextMatch[1]; // [[MATCH_1|MATCH_2]]
		}else {
			prefix = match[1];
		}
		//let parsed = this.utils.tryParseWikiTextLink(match[0]);
    return prefix;
  }

	findMatchingSuggestions(prefix) {
		console.log(prefix);
		let caseSensitive = atom.config.get("MaPerWiki.AutocompleteWikiLink.caseSensitive");

		// filter list of words to those with a matching prefix
		let matchingWords = this.suggestions.filter((suggestion) => {
			return caseSensitive ? suggestion.includes(prefix) : suggestion.toLowerCase().includes(prefix.toLowerCase());
		});
		// convert the array of words into an array of objects with a text property
		let matchingSuggestions = matchingWords.map((word) => {
			return { text: word, iconHTML: '<i class="icon-file"></i>', replacementPrefix: prefix };
		});


		return matchingSuggestions;
	}

}
export default new AutocompleteWikiLink();
