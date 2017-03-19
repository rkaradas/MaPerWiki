"use babel";
import {execFile, exec} from 'child_process'
export default class CustomUserExportHelper
{
  constructor()
  {
  }
  convert(cmd,callback)//(fromPath, saveAsPath,callback)
  {
    try{
      const child = exec(cmd, (error, stdout, stderr) => {
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
