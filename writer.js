#!/usr/bin/env node

var fs = require("fs"),
    hljs = require('highlight.js'),
    marked = require('marked')

var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    ObjectID = mongo.ObjectID

var _usage = "usage: zipf [options] \n\
config <key> <value> [-p]: Read (if -p is present) and set global configuration options \n\
    \tauthor.name <name> : Set the name of the default author for submitting posts to <author> \n\
    \tauthor.email <email> : Set the default author's email to <email> \n\
    \tremote <url> : Set the URL for the mongo database \n\
    \tuseHints <bool> : Set whether or not `hints` should be inserted in documents\n\
help : Print this help message \n\
read [<key> <value>] : Dump the PostDB, or dump the Post where <key> matches <value> \n\
write <post.md> : Write the Zipf flavored Markdown to the PostDB"

marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value
    }
})


/*
    Config class
*/
var Config = function(path) {
    this.preferencesPath = __dirname + "/writer.json"
    if (path) this.preferencesPath = path
    var preferences = JSON.parse(fs.readFileSync(this.preferencesPath, 'utf8'))
    for (pref in preferences) {
        this[pref] = preferences[pref]
    }
}

// Writes the config about to the preference file
Config.prototype.writeFile = function() {
    fs.writeFileSync(this.preferencesPath, JSON.stringify(this), 'utf8')
}

// Helpers for getting config properties
Config.prototype.get = function(field) {
    switch (field) {
        case "author.email":
            return this.author.email
            break
        case "author.name":
            return this.author.name
            break
        case "author":
            return this.author
            break
        case "remote":
            return this.remote
            break
    }
}

// Helpers for setting config properties
Config.prototype.set = function(field, value) {
    switch (field) {
        case "author.email":
            this.author.email = value
            this.writeFile()
            return true
            break
        case "author.name":
            this.author.name = value
            this.writeFile()
            return true
            break
        case "remote":
            this.remote = value
            this.writeFile()
            return true
            break
        case "useHints":
            this.useHints = eval(value.toLowerCase())
            this.writeFile()
            return true
            break
        case "convertMarkdown":
            this.convertMarkdown = eval(value.toLowerCase())
            this.writeFile()
            return true
            break
        default:
            console.log("Invalid config variable")
            return false
    }
}


/*
    Remote class
*/
var Remote = function(url) {
    this.url = url
}

// Reads posts in the database
Remote.prototype.read = function(field, value) {
    var query = {}
    switch (field) {
        case "title":
            query.title = value
            break
        case "id":
            query._id = new ObjectID(value)
            break
        case "email":
            query.email = value
            break
        case "author":
            query.author = value
            break
        case undefined:
            break
        default:
            console.log("Invalid key-value pair")
            return
    }
    MongoClient.connect(this.url, function(err, db) {
        if (err) {
            console.error(err)
            return
        } else {
            db.collection('Posts').find(query).toArray(function(err, posts) {
                console.log(posts)
                db.close()
            })
        }
    })
}

// Inserts a post to the database
Remote.prototype.write = function(post) {
    MongoClient.connect(this.url, function(err, db) {
        if (err) {
            console.error(err)
            return
        } else {
            db.collection('Posts').insertOne(post, function(err) {
                if (err) {
                    console.error(err)
                    return
                } else {
                    console.log("Successfully inserted post")
                }
                db.close()
            })
        }
    })
}


/*
    Markdown Parser (built on-top of marked.js)
*/
var MarkdownParser = function(path) {
    this.text = fs.readFileSync(path, 'utf8')
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

// Returns a "hint string" from the post content (in markdown)
MarkdownParser.prototype.hintFromMarkdownContent = function() {
    var str = this.textWithoutZipfHeader().split("\n")

    // Find the first line that isn't blank or a heading..
    var i = 0
    while (true) {
        if (str[i] == "" | str[i] == " " | str[i] == "\n" | str[i].indexOf("#") == 0) {} else {
            str = str[i]
            break
        }
        i++
    }
    if (str.length > 99) {
        str = str.slice(0, 99)
        str += "..."
    }
    // We have our "hint"
    return str
}

// Returns a "hint string" from the post content (in HTML/default)
MarkdownParser.prototype.hintFromContent = function() {
    var str = this.textAsHTML()
    str = str.slice(str.indexOf('<p>') + 3, str.indexOf('</p>'))
    if (str.length > 99) {
        str = str.slice(0, 99)
        str += "..."
    }
    return str
}

// Returns loaded text (markdown) as HTML
MarkdownParser.prototype.textAsHTML = function() {
    return marked(this.textWithoutZipfHeader())
}

MarkdownParser.prototype.textAsMarkdown = function() {
    return this.textWithoutZipfHeader()
}


/*
    Enter the matrix here -->
*/
function main(args) {
    var config = new Config()
    var remote = new Remote(config.remote)
    switch (args[0]) {
        case "config":
            switch (args.length) {
                case 4:
                    if (args[1] == "set") {
                        if (config.set(args[2], args[3])) {
                            console.log("Successfully wrote changes to writer.json")
                        }
                    }
                    break
                case 3:
                    if (args[1] == "get") {
                        console.log(config.get(args[2]))
                    }
                    break
                case 2:
                    if (args[1] == "get") console.log(config)
                    if (args[1] == "set") console.log("Must supply key-value pair")
                    break
                case 1:
                    console.log(config)
                    break
                default:
                    console.log("Invalid config arguments")
            }
            break
        case "help":
            console.log(_usage)
            break
        case "read":
            if (args.length == 3) {
                remote.read(args[1], args[2])
            } else if (args.length == 1) {
                remote.read()
            } else {
                console.log("Invalid use of the read command")
            }
            break
        case "write":
            if (args.length == 2) {
                var parser = new MarkdownParser(args[1])
                var post = parser.parseZipfHeader()
                if (config.convertMarkdown) {
                    post.content = parser.textAsHTML()
                } else {
                    post.content = parser.textAsMarkdown()
                }
                if (config.useHints) {
                    post.hint = parser.hintFromContent()
                }
                post.date = {
                    created: Math.round(new Date().getTime() / 1000.0),
                    edited: Math.round(new Date().getTime() / 1000.0)
                }
                console.log(post)
            } else {
                console.log("Invalid use of the write command")
            }
            break
        default:
            console.log(_usage)
    }
}

if (require.main == module) {
    main(process.argv.slice(2))
} else {
    console.error("Not a library use `node writer.js` to use this script")
    process.exit(-1)
}
