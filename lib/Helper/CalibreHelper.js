"use babel";
import {execFile} from 'child_process'
export default class CalibreHelper
{
  constructor()
  {
  }




  convert(fromPath, saveAsPath, cwdir, callback)
  {
    try{

      var cmd = "ebook-convert";
      var args = [];

      // from
      args.push(fromPath);

      // to
      args.push(saveAsPath);
      args.push('--input-encoding');
      args.push('"utf8"');



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
