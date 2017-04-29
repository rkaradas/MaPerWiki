# MaPerWiki

This package turns Atom into a Markdown personal Wiki. To get the best experience you have to install [pandoc](http://pandoc.org/installing.html), [calibre-ebook](https://calibre-ebook.com/download) and add a reference of the install location into your PATH variable.
Furthermore you have to install the following packages.

* [markdown-preview-enhanced](https://atom.io/packages/markdown-preview-enhanced) (highly recommended)
* [tool-bar](https://atom.io/packages/tool-bar) (highly recommended)
* [markdown-writer](https://atom.io/packages/markdown-writer) (recommended)
* [tool-bar-markdown-writer](https://atom.io/packages/tool-bar-markdown-writer) (recommended)

# Feature overview

  * [WikiLink checker](#wikilink-checker)
  * [WikiSearch](#wikisearch)
  * [Export (pandoc/calibre-ebook)](#export)
  * [TOC](#toc)
  * [WikiHome](#wikihome)
  * [WikiNavigation](#wikinavigation)
  * [Orphaned WikiPages checker](#orphaned-wikipages-checker)
  * [Wordcount](#wordcount)
  * [Autosave](#autosave)
  * [Drag and Drop](#drag-and-drop)
  * [Toggle edit/preview](#toggle-edit-and-preview)


## WikiLink checker

### Description

The WikiLink checker, checks for broken links, within all markdown files.
A broken link can be a markdown file, an anchor or image files.
If the broken WikiLink is a markdown file, you can create a new file at the referenced location.

The WikiLink checker, also tries to find alternative locations, by searching the Wiki (project) for matching filenames. It lists the alternative files for each link, so you can decide, which is the correct one and easily link to it. Furthermore you can navigate to each broken WikiLink to manually change it.

#### Settings
![](https://github.com/rkaradas/MaPerWiki/raw/master/images/settings-linkchecker.png)

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-alt-l</kbd>           | Toggle WikiLink checker|

#### Features
  * Autocheck broken WikiLinks with the given interval
  * Find alternative links for a broken WikiLink
  * Link to an alternative link
  * Jump to broken WikiLink
  * Create new (md)-file at the the referenced location
  * Statusbar integration

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-linkchecker.gif)


## WikiSearch

### Description
The WikiSearch is somehow like the built-in search, but only searches in markdown files.
The representation of the results is also different. The WikiSearch keeps your search results in the panel (search history), so you can keep track of the results. If you want to remove a specific search or the complete results, you can do that too. You can also abort a running search action, if it takes too long.

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-wikisearch.png)

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-alt-s</kbd>           | Toggle WikiSearch|

#### Features
  * Search in current file
  * Search in project
  * Search with regular expression and/or case sensitive and/or whole word
  * Abort current search action
  * Remove search entry
  * Clear all search results
  * Ignore symbolic links

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-wikisearch.gif)

## Export

### Description
The export function requires pandoc and calibre-ebook, so make sure you install the applications and add their binary pathes to your PATH variable.
Before you can export markdown files to a specific target, you have to drag and drop those into the ExportSelection area.
If you have selected some files, the export feature allows you to export them into predefined targets or custom exports.

  **Current predefined targets**

  * markdown
  * html
  * github flavored markdown
  * word document
  * epub
  * mobi
  * pdf

If you need to set your own export commands, e.g. you use a latex preprocessor, you can add them in the custom export params section in the export panel (see demo).

  **Parameters**

  * Export name represents the name of the custom export
  * Export value represents the custom command. You can set (multiple) **%1** and **%2** params into your command, where
    * **%1** represents the input file (it's a single concatenated file of the files you want to export)
    * **%2** the output file (set in the "save as" textbox)
    * Export extension represents the extension, that the exported file will have. This parameter also automatically changes the extension in the save as textbox if you select the custom export.

Of course you can ignore %2 and the custom extension, if your command or script handles the export.

#### Settings
**Custom settings, refer to demo**

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-alt-e</kbd>           | Toggle Export|

#### Features
  * Export to predefined targets
  * Add custom export targets
  * Select files/folders to export (drag and drop from atom tree-view into export selection)
  * Reorder files/folders within export selection
  * Remove added files/folders (drag and drop from export selection into trash icon)

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-export.gif)


## TOC

### Description
The table of contents feature displays a toc panel for the current markdown file, so you have an overview of the headings of your markdown file. The toc supports setext as well as atx style (refer to: [markdown syntax](https://daringfireball.net/projects/markdown/syntax#header)).
You can navigate to a heading entry by clicking it.

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-toc.png)

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-alt-h</kbd>           | Toggle toc|
|<kbd>ctrl-alt-u</kbd>           | Switch toc to left/right|

#### Features
  * Jump to heading entry
  * Toggle toc
  * Switch toc to right or left
  * Expand/collapse heading entry
  * Expand/collapse all headings
  * Refresh toc
  * Automatically number headings

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-toc.gif)


## WikiHome

### Description
The WikiHome is designed to specify a markdown file as WikiHome, so have an entry point to your wiki.
You can manually change it in the settings of this package, with the defined shortcut or in the context menu of the atom text editor. If the file doesn't exist, it will be created.

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-wikihome.png)

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-shift-alt-home</kbd>  | Go to WikiHome|
|<kbd>ctrl-shift-alt-h</kbd>     | Set current file as WikiHome|

#### Features
  * Set a markdown file as WikiHome
  * Go to WikiHome

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-wikihome.gif)

## WikiNavigation

### Description
The WikiHome is designed to specify a markdown file as WikiHome, so you have an entry point to your wiki.
You can manually change it in the settings of this package, with the defined shortcut or in the context menu of the atom text editor. If the file doesn't exist, it will be created.

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-wikipagenavigation.png)

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-shift-alt-home</kbd>  | Go to WikiHome|
|<kbd>ctrl-shift-alt-left</kbd>  | Go page back|
|<kbd>ctrl-shift-alt-right</kbd> | Go page forward|

#### Features
  * Go to WikiHome
  * Go page back
  * Go page forward

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-wikipagenavigation.gif)

## Orphaned WikiPages checker

### Description
The orphaned WikiPages checker, checks for WikiPages (markdown files), which are not referenced (not linked) in the whole Wiki project folder and mark them (red foreground color) in the atom tree view.
Note: If the tree view gets redrawn, you have to, manually, check again.

#### Settings
**No settings available**

#### Default keyboard shortcuts

|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-alt-o</kbd>           | Check orphaned WikiPages|

#### Features
  * Check orphaned WikiPages
  * Mark orphaned WikiPages in atom tree-view

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-orphanedwikipageschecker.gif)

## Wordcount

### Description
The wordcount feature, counts words, characters, rows, etc. Please refer to wordcount features section for all properties.  

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-wordcount.png)

#### Default keyboard shortcuts
**No shortcuts available**

#### Features
  * Count number of words
  * Count number of characters
  * Count number of characters without whitespace
  * Count number of rows
  * Count number of paragraphs
  * Statusbar integration (clickable for details)
  * Set goal (number of words)
  * Show goal in percentage (if goal set)
  * Show goal as progress (statusbar)

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-wordcount.gif)

## Autosave

### Description
The autosave function has no visual user interface, but you can change the behavior in the autosave settings section of this package.
If the autosave function is enabled, it will automatically save all open markdown documents in the given interval.

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-autosave.png)

#### Default keyboard shortcuts
**No shortcuts available**

#### Features
  * Enable/Disable autosave
  * Set autosave interval

#### Demo
**No demo available**

## Drag and Drop

### Description
The drag and drop function also has no visual user interface, but you can change the behavior in the drag and drop settings section of this package.
The drag and drop feature has the following behavior.
  * If there is a selected text and you drop a project file (md or image file) into the text editor, it will replace the selection with a markdown link
  * If there is no selection, it will fallback to the current settings. That means that it will either "copy the link into the clipboard" or "paste it to the last cursor position".

#### Settings
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/settings-dragndrop.png)

#### Default keyboard shortcuts
**No shortcuts available**

#### Features
  * Enable/disable drag and drop
  * Replace selection with a markdown link (dropped md or image file)
  * Copy markdown link to clipboard
  * Paste markdown link to last cursor position

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-dragndrop.gif)

## Toggle edit and preview

### Description
This feature toggles between three modes (requires [markdown-preview-enhanced](https://atom.io/packages/markdown-preview-enhanced))
  * Just preview mode
  * Just edit mode
  * Edit and preview mode

Feels like a Wiki in combination with WikiNavigation, WikiHome and WikiSearch, because once you've edited your wiki pages, you can
  * Search your Wiki
  * Navigate back- and forward
  * Go to WikiHome
  * Switch back to edit mode


#### Settings
**No settings available**

#### Default keyboard shortcuts
|Shortcut| Action|
|--------|-------|
|<kbd>ctrl-alt-m</kbd>           | Toggle edit/preview|

#### Features
  * Switch between edit, preview and edit&preview mode

#### Demo
![](https://raw.githubusercontent.com/rkaradas/MaPerWiki/master/images/demo-toggleeditpreview.gif)
