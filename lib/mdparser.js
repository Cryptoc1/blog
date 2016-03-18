var marked = require('marked'),
    hljs = require('highlight.js'),
    fs = require('fs')

marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value
    }
})

/*
    Markdown Parser (built on-top of marked.js)
*/
var MarkdownParser = function(text) {
    this.text = text
}

// Parses the zipf header and returns the information as object
MarkdownParser.prototype.parseZipfHeader = function() {
    var metadata = {}
    var header = this.text.slice(11, this.text.indexOf('@end_zipf')).trim()
    header.split("\n").map(function(line) {
        line = line.split(':=')
        for (var i = 0; i < line.length; i++) {
            line[i] = line[i].trim()
        }
        if (line[0].trim() == "tags") line[1] = line[1].split(', ')
        metadata[line[0]] = line[1]
    })
    return metadata
}

// Remove the zipf header from the text
MarkdownParser.prototype.trimZipfHeader = function() {
    this.text = this.text.slice(this.text.indexOf('@end_zipf') + 9).trim()
}

// Returns loaded text without the zipf header
MarkdownParser.prototype.textWithoutZipfHeader = function() {
    return this.text.slice(this.text.indexOf('@end_zipf') + 9).trim()
}

// Returns a "hint string" from the post content (in HTML/default)
MarkdownParser.prototype.hintFromHTMLContent = function() {
    var str = this.textAsHTML()
    str = str.slice(str.indexOf('<p>') + 3, str.indexOf('</p>')).replace(/(<([^>]+)>)/ig, "")
    if (str.length > 147) {
        str = str.slice(0, 147)
        str += "..."
    }
    return str
}

// Returns loaded text (markdown) as HTML
MarkdownParser.prototype.textAsHTML = function() {
    return marked(this.textWithoutZipfHeader())
}

module.exports = MarkdownParser
