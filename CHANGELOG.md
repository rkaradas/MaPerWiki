# 0.1.26 AutocompleteWikiLink & JumpToWikiLink
* [fixed] AutocompleteWikiLink: Replacement string not replacing dots
* [fixed] JumpToWikiLink: MacOS not opening weburls
* [Added] JumpToWikiLink: Configurable (alt, ctrl, cmd or shift) key + click to open WikiLink

# 0.1.26 AutocompleteWikiLink & JumpToWikiLink
* [Changed] Since I use new Atom api functions, you need Atom version >=1.18.0
* [Added] AutocompleteWikiLink: Configurable case sensitive match.
* [Added] AutocompleteWikiLink: Include all project files. If set to tru, includes all project files (not just markdown files).
* [Changed] JumpToWikiLink: Now you can also open links if the cursor is above the title are of the link.     
* [Changed] JumpToWikiLink: Now you can open web urls, if the option "open non markdown files" is set to true and the link under the cursor is a web url.
* [Added] Added a helper class "utils" for recurring tasks
* [Added] Support for WikiText link syntax for AutocompleteWikiLink and JumpToWikiLink functions.

# 0.1.25 Bugfixes
* [fixed] Toggle edit&preview: Fixed "not switching to just preview mode"
* [fixed] OrphanedWikiPages: Fixed not highlighting orphaned files in tree-view
* [fixed] JumpToWikiLink: Not opening Markdown links correctly    

# 0.1.24 JumpToWikiLink & AutocompleteWikiLink
* [Added] JumpToWikiLink: Opens the markdown file under the cursor within a markdown link by pressing the corresponding keys or command (MaPerWiki:jumpToWikiLink) [#5](https://github.com/rkaradas/MaPerWiki/issues/5)
* [Added] AutocompleteWikiLink: Provides suggestions (markdown project files) within a markdown link [#6](https://github.com/rkaradas/MaPerWiki/issues/6)

# 0.1.23 Toggle edit&preview fixed
* [fixed] Toggle edit&preview: Fixed "not switching to just preview mode"

# 0.1.22 Keymaps, readme and package changes
* [Changed] Keymaps: Some keymaps changed, because of the different OS's
* [Updated] Readme: Minor changes
* [Updated] Package description and keywords: Removed [Experimental] and added keywords

# 0.1.21 LinkChecker fix and readme update
* [fixed] LinkChecker: fixed issue [#2](https://github.com/rkaradas/MaPerWiki/issues/2)
* [updated] Readme: Tables not showing correctly

# 0.1.20 Readme update and toc fix  
* [fixed] TOC: Showing false positive headings, e.g. comments in python code blocks  

# 0.1.19 WikiNavigation changes & disabled console output  
* [Added] WikiNavigation: Remove deleted entries from history
* [Added] WikiNavigation: Keep, configurable, nr. of tabs open (with option to autosave changed files)
* [Changed] Console output: Disabled by default. Can be activated by setting "window.mpwShowOutput = true;" in dev console.

# 0.1.18 Export & WikiNavigation fix, WikiSearch & Maximize Preview enhancement
* [fixed] Export: Changed cwd to saveas directory
* [fixed] WikiNavigation: Detect all md files in all panes
* [Added] Export: Open save dialog
* [Added] WikiSearch: Added abort search for long running searches.
* [Changed] Maximize Preview: Changed maximize preview to toggle between edit&preview, just edit, just preview

# 0.1.17 Export, WikiSearch, Keymaps
* [Changed] Export: Removed pandoc args
* [Changed] Export: Temp file generating method
* [Changed] WikiSearch: Live update for each file instead of update when done
* [Changed] WikiSearch: focus textbox on show panel
* [Added] WikiSearch: Configurable include symbolic links
* [Added] WikiSearch: Sort entries by path
* [Added] Keymaps for WikiNavigation, expand MPE, etc.
* [Added] CalibreHelper --input-encoding utf8
* [fixed] Prevent closing tool-bar when positioned at bottom, not full width and opening WikiSearch etc.

# 0.1.16 Export, CustomUserExport, WikiNavigation
* [Changed] Export: Drag and drop from project folder (tree view) into exportlist
* [Changed] Export: Design looks now like the atom tree-view
* [Added] Export: Trashcan to delete added entries.
* [fixed] Export: Not adding empty folders (without md files)
* [fixed] CustomUserExport: Fixed always selecting first entry.
* [Changed] WikiNavigation: Not setting initialColumn/-row to 0

# 0.1.15 CustomUserExport fix
* [fixed] Fixed multiple param replacement.

# 0.1.14 Maximize Preview, Export, WikiSearch, CustomUserExport
* [Added] Maximize markdown preview enhanced
* [Changed] Export: added drag and drop from export files to export Selection
* [Added] WikiSearch: Toggle WikiSearch with selection -> populate searchTerm with selection.
* [Added] WikiSearch: IsBusy indicator and disabling buttons if IsBusy.
* [Added] Export: Custom export params settings page (atom does not show the config in the package settings of the array of objects defined in config-schema.json)
* [Added] Export: Custom export params with param %1=inputfile (selected input md files) and %2=outputfile (save as).
* [Added] CustomUserExport: processes the given custom export command.
* [Added] Exception handling for Pandoc, Calibre and CustomUserExport

# 0.1.13 OrphanedWikiPages
* [Fixed] OrphanedWikiPages showing all files as orphaned
* [Fixed] SearchResults fixed issue [#1](https://github.com/rkaradas/MaPerWiki/issues/1)

# 0.1.12 SearchResults fix & OrphanedWikiPages/WikiHome
* [Fixed] WikiHome shouldn't be an orphaned page, because it's home :)
* [Fixed] SearchResults fixed issue [#1](https://github.com/rkaradas/MaPerWiki/issues/1) note: [Vue array change detection](https://vuejs.org/v2/guide/list.html#Array-Change-Detection).

# 0.1.11 WikiPageNavigation fix & WikiSearch improvements
* [Fixed] Exception handling on dis-/enabling back and forward tool-bar button
* [Changed] WikiSearch behavior: Results panel always shows after your first search, so you can get back to the results without performing another search.
* [Added] WikiSearch clear results.
* [Added] WikiSearch remove entry from history.

# 0.1.10 TOC, WikiHome, WikiPageNavigation, Orphaned WikiPages checker
* [Added] Configurable WikiHome page and toolbar button
* [Added] WikiPageNavigation back- and forward
* [Added] Check orphaned (not linked) WikiPages (marks orphaned files in the tree view)
* [Added] TOC setext support
* [Fixed] TOC jump to header (mpe sync scroll)

# 0.1.9 Search and LinkChecker changes
* [Added] Search default "Enter"-KeyEvent triggers FindWiki
* [Added] LinkChecker config section (de-/activate linkchecker & interval)
* [Fixed] Changelog (version sync)

# 0.1.7 - 0.1.8 - Export, LinkChecker and TOC improvements
* [Added] Export formats
* [Fixed] Export empty args
* [Fixed] Link Checker replace, when title and link are exactly the same.
* [Added] Link Checker support for anchor links.
* [Added] Link Checker empty result hint
* [Fixed] TOC icons not showing
* [Fixed] TOC not showing, because of grammar, added configurable extension
* [Changed] Config descriptions, ...

# 0.1.6 - Minor changes & corrected changelog
* [Fixed] Drag and Drop (relative path separator)
* [Fixed] WikiLink checker (path separator for alternative links)
* [Fixed] Export (path separator)
* [Fixed] Changelog (version sync)

# 0.1.5 - Wiki search & minor changes
* [Added] WikiLink checker
* [Added] WikiLink checker status-bar
* [Added] TOC switch right/left
* [Added] Tool-bar items (toggle link checker/wiki search/export)
* [Added] keymaps
* [Changed] Drag and Drop (relative paths)
* [Changed] TOC style
* [Changed] Menu and context-menu structure
* [Changed] Panel visibility (hide all panels, if other panel opens)
* [Fixed] Wiki search (close action)
* [Fixed] Wiki search (regular expression)
* [Fixed] Drag and Drop (not project files info message)
* [Fixed] Wiki search (no TextEditor active)

# 0.1.4 - Wiki search & minor changes
* [Added] Wiki search panel
* [Added] Wiki search results panel
* [Changed] Menu entries and names

# 0.1.3 - Drag and Drop changes
* [changed] Drag and Drop behavior

# 0.1.1 - 0.1.2 - fix
* [fixed] CompositeDisposable exception

# 0.1.0 - initial
* [Added] Autosave
* [Added] Wordcount
* [Added] Export (Pandoc)
* [Added] Drag and Drop
* [Added] TOC
