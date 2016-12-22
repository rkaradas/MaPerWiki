'use babel';

export default class Autosave
{
  constructor()
  {

    atom.config.observe("MaPerWiki.Autosave.autosaveInterval", (value)=>{
      if(value && value > 1)
      {
        var isEnabled = atom.config.get("MaPerWiki.Autosave.autosaveOn");
        if(isEnabled){
          this.autoSaveIntervalReference = this.updateSaveInterval(this.autoSaveIntervalReference,value*1000);
        }
      }
    });
    atom.config.observe("MaPerWiki.Autosave.autosaveOn", (value)=>{
      if(value)
      {
        var autosaveInterval = atom.config.get("MaPerWiki.Autosave.autosaveInterval");
        this.autoSaveIntervalReference = this.updateSaveInterval(this.autoSaveIntervalReference,autosaveInterval*1000);
      }
      else
      {
        this.deactivateAutosave();
      }
    });
  }


  updateSaveInterval(autoSaveIntervalReference, interval ){
    this.deactivateAutosave();
    return setInterval(()=>{
        var textEditors = atom.workspace.getTextEditors();
        for(var val of textEditors)
        {
          try {
            val.save();
          }
          catch (e) {
            // statements to handle any exceptions
            console.log(e);
          }
        }

     }, interval);
  }

  deactivateAutosave()
  {
    if(this.autoSaveIntervalReference){
      clearInterval(this.autoSaveIntervalReference);
    }
  }
}
