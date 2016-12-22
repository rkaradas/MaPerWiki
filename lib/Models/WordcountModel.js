"use babel"

export default class WordcountModel
{

  init()
  {
    this.wordCount = 0;
    this.characterCountWithoutWhitespace = 0;
    this.characterCount = 0;
    this.rows = 0;
    this.paragraphs = 0;
    this.goal = 0;
    this.goalPercentage = 0;
    this.goalProgressColor = atom.config.get("MaPerWiki.Wordcount.Goal.ProgressColor");
    this.goalBackgroundColor = atom.config.get("MaPerWiki.Wordcount.Goal.BackgroundColor");
    this.goalFontWeight = atom.config.get("MaPerWiki.Wordcount.Goal.FontWeight");
    this.goalFontColor = atom.config.get("MaPerWiki.Wordcount.Goal.FontColor");
  }

  async updateCount(editor)
  {
    var text = this.getCurrentText(editor);
    var codePatterns, i, len, pattern, text, ref, green;

    if (atom.config.get("MaPerWiki.Wordcount.ignorecode")) {
      codePatterns = [/`{3}(.|\s)*?(`{3}|$)/g, /[ ]{4}.*?$/gm];
      for (i = 0, len = codePatterns.length; i < len; i++) {
        pattern = codePatterns[i];
        text = text != null ? text.replace(pattern, '') : void 0;
      }
    }

    this.wordCount = typeof text !== "undefined" && text !== null ? (ref = text.match(/\S+/g)) != null ? ref.length : 0 : 0;
    this.characterCount = typeof text !== "undefined" && text !== null ? text.length : 0;
    this.characterCountWithoutWhitespace = typeof text !== "undefined" && text !== null ? text.replace(/ /g,"").length : 0;
    this.rows = text.split(/\r\n|\r|\n/).length;
    this.paragraphs = text.replace(/\n$/gm, '').split(/\n/).length;

    this.goal = atom.config.get("MaPerWiki.Wordcount.Goal.Number");
    this.goalProgressColor = this.getRGBA( atom.config.get("MaPerWiki.Wordcount.Goal.ProgressColor") );
    this.goalBackgroundColor = this.getRGBA( atom.config.get("MaPerWiki.Wordcount.Goal.BackgroundColor") );
    this.goalFontColor = this.getRGBA( atom.config.get("MaPerWiki.Wordcount.Goal.FontColor") );
    this.goalFontWeight = atom.config.get("MaPerWiki.Wordcount.Goal.FontWeight");
    if(this.goal)
    {
      this.goalPercentage = Math.round(this.wordCount / this.goal * 100) ;
      this.goalPercentage = this.goalPercentage > 100 ? 100 : this.goalPercentage;

    }


  }

  getRGBA(obj)
  {
    return `rgba( ${obj.red}, ${obj.green}, ${obj.blue}, ${obj.alpha} )`;
  }
  getCurrentText(editor)
  {
      var selection = editor.getSelectedText();
      text = editor.getText();
      return selection || text;
  }
}
