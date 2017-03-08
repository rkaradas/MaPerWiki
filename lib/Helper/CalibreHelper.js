"use babel";
import {execFile} from 'child_process'
export default class CalibreHelper
{
  constructor()
  {
  }




  convert(fromPath, saveAsPath,callback)
  {

    var cmd = "ebook-convert";
    var args = [];

    // from
    args.push(fromPath);

    // to
    args.push(saveAsPath);



    const child = execFile(cmd, args, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log(stdout);
      if(callback)
        callback();
    });
  }

}
