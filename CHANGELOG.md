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
