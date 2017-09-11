"use babel";

export default class Utils
{
  constructor()
  {
    this.markdownLinkRegexPattern = /!?\[(.*?)(?=\]\()\]\((.*?)(?: +"(.*)")?\)/;
    this.webUrlRegexPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  }

  tryParseMarkdownLink(text)
  {
    return text.match(new RegExp(this.markdownLinkRegexPattern,'i'));
  }

  tryParseWikiTextLink(text)
  {
    return this.parseLink(text,0);
  }

  parseLink(content, pos){
    if (content.slice(pos, pos + 2) == "[["){
      var link = "";
      pos += 2;
      while (content.slice(pos, pos + 2) != "]]"){
        if (content.slice(pos, pos + 2) == "[["){
          var out = this.parseLink(content, pos);
          link += out.text;
          pos = out.pos;
        } else {
          link += content[pos];
          pos++;
        }
      }
      pos += 2;

      var args = link.split("|");
      if (args.length == 1)
        return {text: args[0], pos: pos};
      else {
        if (args[0].slice(0, 5) == "File:")
          return {text: "", pos: pos}
        return {text: args[1], pos: pos};
      }
    }
    return {text: null, pos: pos};
  }

  tryParseWebUrl(text)
  {
    return text.match(new RegExp(this.webUrlRegexPattern,'i'))
  }
}
