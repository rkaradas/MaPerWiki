"use babel";
import {execFile} from 'child_process'
export default class PandocHelper
{
  constructor()
  {
    this.files = [];
  }




  convert(saveAsPath, argsString, fromFormat, toFormat, cwdir, callback)
  {
    try{
      var cmd = "pandoc";
      var args = [];

      // from format
      args.push("-f");
      args.push(fromFormat?fromFormat:"markdown");

      // to format
      args.push("-t");
      args.push(toFormat?toFormat:"html");

      // output file
      args.push("-o");
      args.push(saveAsPath);

      var splittedArgsString = argsString.split(" ");
      splittedArgsString.forEach((itm)=>{
        if(itm != "")
          args.push(itm);
      });


      // input files
      this.files.forEach((file)=>{
          args.push(file);
      });


      const child = execFile(cmd, args, {cwd: cwdir}, (error, stdout, stderr) => {
        if (error) {
          if(window.mpwShowOutput)
            console.log(error);
          callback(error);
          return;
        }
        if(window.mpwShowOutput)
          console.log(stdout);
        if(callback)
          callback();
      });

    }catch(ex)
    {
      callback(ex);
    }
  }

}
