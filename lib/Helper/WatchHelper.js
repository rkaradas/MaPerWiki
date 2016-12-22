'use babel';

import { Emitter, File, Directory } from 'atom'
import path from 'path'
import Chokidar from 'chokidar'


var selfInstance;
export default class WatchHelper
{

  constructor()//rootPaths)
  {
    selfInstance = this;
    this.directories = [];
    this.paths = [];
    /*
    if(Array.isArray(rootPaths))
      this.rootPaths = rootPaths
    else
    */
      this.rootPaths = atom.workspace.project.getDirectories();

    this.emitter = new Emitter();
    this.initalScanComplete = false;
    this.startWatch();

    //this.recursiveDirectoryListener(this.rootPaths[0]);

  }



  startWatch()
  {
    var paths = atom.workspace.project.getPaths();
    //Chokidar.watch(paths[0] + "\\**\\*.@(md)", {ignored: paths[0] + '\\@(node_modules)\\**\\*.*'}).on('all', (event, path) => {
    Chokidar.watch(paths[0] + "/**/*").on('all', (event, path) => {
      if(event == "add" )//&& !selfInstance.files.find( x => x.path == path) )
      {
        this.paths.push(path);
      }
      console.log(`${event}: ${path}`);
    })
    .on('ready', () =>{
      this.initalScanComplete = true;
      console.log('Initial scan complete. Ready for changes')
    });
  }

  recursiveDirectoryListener(dir)
  {
    if(!dir.path.includes("node_modules")){
      var el = {path: dir.path, files: [], dirObj: dir};
      this.directories.push(el);
      dir.onDidChange(()=>{
        var fEntries = dir.getEntriesSync();
        var foundDir;
        if(foundDir = selfInstance.directories.find( x => x.path == dir.path)){
          // use to add new files, that were not there before
          // or to detect move operations, because rename and delete
          // will be listened in file events

          if(fEntries.length > 0)
          {
            fEntries.forEach((itm)=>
            {
              var foundFile = foundDir.files.find(x => x.path == itm.getPath());
              // Add operation (new file and move operation Note: move operation works because,
              // the file listener takes care of the delete event...)
              if(itm.isFile() && !foundFile)
              {
                foundDir.files.push(itm);
                var digest = itm.getDigest();
                this.addFileListeners(itm,foundDir);
                this.emitter.emit('add', itm);
              }

              // ToDo: Check if child is directory

            });
          }

        }
      });

      dir.getEntries((error, entries)=>{

        if(entries.length > 0)
        {
          entries.forEach((itm)=>
          {
            if(itm.isDirectory())
            {
              this.recursiveDirectoryListener(itm);
            }
            else if(itm.isFile())
            {
              el.files.push(itm);
              this.addFileListeners(itm, el);
            }
          });
        }
      });
    }
  }

  addFileListeners(itm, el)
  {
    itm.onDidRename(()=>{
      var file = itm;
      this.emitter.emit('rename', file);
      var bp = "bp";
    });
    itm.onDidDelete(()=>{
      var file = itm;
      var digest = itm.getDigest();
      var fileIdx = el.files.indexOf(itm);
      el.files.splice(fileIdx, 1); // delete the item
      var bp = "bp";
      this.emitter.emit('delete', file);


    });
    itm.emitter.on("moved",(a,b,c,d) => {

      var bp = "bp";
    });
  }

  printDirs()
  {
    this.directories.forEach((itm,idx)=>{
      console.log(itm.path);
      if(itm.files)
      {
        itm.files.forEach((fItm,fIdx)=>{
          console.log(`- ${fItm.path}`);
        });
      }
    });
  }
  // BEGIN EVENT SECTION
  onAdd(callback)
  {
    this.emitter.on("add",callback);
  }
  onDelete(callback)
  {
    this.emitter.on("delete",callback);
  }
  onRename(callback)
  {
    this.emitter.on("rename",callback);
  }
  onMove(callback)
  {
    this.emitter.on("move",callback);
  }
  // END EVENT SECTION
}
