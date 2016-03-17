var fs = require('fs')

var zipf = function() {
    this.version = "v1.0.0"
}

zipf.prototype.init = function(path) {
    var configPath = __dirname + "/zipf.json"
    if (path) configPath = path
    var config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    for (pref in config) {
        this[pref] = config[pref]
    }
    this.themePath = "themes/" + this.theme
    this.staticPath = this.themePath + "/static"
}

zipf.prototype.parseHintFromContentString = function(str) {
    var str = str.split('\n')
        // Find the first line that isn't blank or a heading..
    var i = 0
    while (true) {
        if (str[i] == "" | str[i] == " " | str[i] == "\n" | str[i].indexOf("#") == 0) {} else {
            str = str[i]
            break
        }
        i++
    }
    if (str.length > 300) {
        str = str.substring(0, 300)
        str += "..."
    }
    // We have our content "hint"
    return str
}

module.exports = new zipf()
