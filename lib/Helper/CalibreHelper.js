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
          console.log(error);
          callback(error);
          return;
        }
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
