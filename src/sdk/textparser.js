class QiscusTextParser {
  constructor() {
    // check the extension
    this.imageLink         = /(\b(https?|ftp|file):\/\/\S+\/([A-Z0-9\-\.\+\_%]+)(\.png|\.jpg|\.gif|\.jpeg|\.jpeg\-large)[-A-Z0-9+&@#\/\?;%=~_|$?!:,.]*)/gi;
    this.youtubeLink       = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*([\S]*)/gi;
    this.googleIframe      = /\<p\>&lt;iframe src=(&quot;|"|')(https?)(:\/\/(www.)?google\.com\/maps\/embed\?(\S)*)(&quot;|'|")(.)*&lt;\/iframe\&gt;\<\/p\>/gi;
    this.linkPattern       = /((?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:;,.\|\(\[\{\}\]\`\^]*[A-Z0-9+&@#\/%=~_|$\)])(?!([^<]+)?>)/gi;
    this.BitbucketNotif    = /#bitbucket(\r\n|\r|\n)(([a-z0-9]|\-|_)*)( push to )((\S)*)( on branch )((\S)*)( with commit : )((\S| |\r\n|\r|\n|\t)*)( )\[([0-9a-z])*\] \. link to commit : ((\S)*)\/([a-z0-9]*)/i;
    this.DropboxImg        = /https?:\/\/(www\.dropbox)\.com\/((\S)*)\.(jpeg|jpg|gif|png)\?(dl\=(0|1))/gi;
    this.DropboxFile       = /https?:\/\/(www\.dropbox)\.com\/((\S)*)\/((\S)*)\.(\S*)\?(dl\=(0|1))/gi;
  }

  replaceTag(tag){
    const tagsToReplace =  {
      // '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    }
    return tagsToReplace[tag] || tag;
  }
  
  safeTagsReplace(str){
    return str.replace(/[&<>]/g, this.replaceTag);
  }
  
  parse(text) {
    let renderedText = this.safeTagsReplace(text);
    renderedText = renderedText.replace(this.googleIframe,'<iframe style="border:1px solid #dedede;" width="455" height="320" src="https$3" frameborder="0"></iframe><br/>')
    renderedText = renderedText.replace(this.youtubeLink,'<p><iframe style="border:1px solid #dedede;" width="455" height="320" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></p>')
      // .replace(this.imageLink,"<span class='imageloader loaded'><img src='$1' alt='$3$4' /></span>")
    renderedText = this.transformNonHttpUrl(renderedText); 
    renderedText = renderedText.replace(this.linkPattern, '<a href="$1" target="_blank">$1</a>')
    return renderedText;
  }

  transformNonHttpUrl(text) {
    let transformedText = text;
    let httpUrls = text.match(this.linkPattern);
    if(!httpUrls) return transformedText;
    httpUrls.forEach(txt => {
      let httpUrl = (txt.substr(0,4) === 'http') ? txt : `https://${txt}`;
      transformedText = transformedText.replace(txt, httpUrl)
    });
    return transformedText;
  }
}


module.exports = new QiscusTextParser();