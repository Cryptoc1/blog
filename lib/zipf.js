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

module.exports = new zipf()
