var express = require('express'),
    handlebars = require('express-handlebars'),
    dotenv = require('dotenv'),
<<<<<<< HEAD
=======
    marked = require('marked'),
    hljs = require('highlight.js'),
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
    app = express()

var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    ObjectID = mongo.ObjectID

<<<<<<< HEAD
var zipf = require('./lib/zipf.js')
zipf.init()

dotenv.config()

var url = process.env.REMOTE_URI || zipf.remote

app.use(express.static(zipf.staticPath))
app.use(express.static('public'))

app.set("views", zipf.themePath + "/views/")
app.engine('handlebars', handlebars({
    layoutsDir: zipf.themePath + "/views/layouts/",
=======
dotenv.config()

var url = process.env.REMOTE_URI

app.use(express.static('public'))

app.engine('handlebars', handlebars({
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
    defaultLayout: 'default'
}))
app.set('view engine', 'handlebars')

<<<<<<< HEAD
=======
marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value
    }
})

>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
app.get('/', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).render('index', Error(522, req.path))
            console.error(err)
        } else {
            var collection = db.collection('Posts')
            collection.find().sort({
                "date.created": -1
            }).limit(10).toArray(function(err, posts) {
                if (err) {
                    res.status(578).render('index', Error(578, req.path))
                    console.error(err)
                } else {
<<<<<<< HEAD
=======
                    posts.map(function(post) {
                        post.hint = parseHintFromContentString(post.content)
                    })
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
                    collection.count(function(err, count) {
                        if (err) {
                            console.error(err)
                        } else {
                            var showLoader = false
                            if (posts.length < count) {
                                showLoader = true
                            }
                            res.render('index', {
                                endpoint: "Samuel Steele",
                                count: count,
                                posts: posts,
                                showLoader: showLoader
                            })
                        }
<<<<<<< HEAD
                        db.close()
=======
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
                    })
                }
            })
        }
    })
})

app.get('/post/:id', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).render('post', Error(522, req.path))
            console.error(err)
        } else {
            if (!(/[a-f0-9]{24}/.test(req.params.id))) {
                res.status(433).render('post', Error(433, req.path))
            } else {
                db.collection('Posts').findOne({
                    _id: ObjectID(req.params.id)
                }, function(err, post) {
                    if (err) {
                        res.status(578).render('post', Error(578, req.path))
                        console.error(err)
                    } else {
                        // @TODO: Render tags
                        res.render('post', {
                            endpoint: post.title,
<<<<<<< HEAD
                            content: post.content
                        })
                    }
                    db.close()
=======
                            content: marked(post.content)
                        })
                    }
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
                })
            }
        }
    })
})

app.get('/api/v1/posts', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).json(Error(522))
            console.error(err)
        } else {
            var offset = 0
            if (req.query.offset) {
                offset = parseInt(req.query.offset)
            }
            db.collection('Posts').find().sort({
                "date.created": -1
            }).skip(offset).limit(10).toArray(function(err, posts) {
                if (err) {
                    res.status(578).json(Error(578, req.path))
                    console.error(err)
                } else {
<<<<<<< HEAD
                    res.json(posts)
                }
                db.close()
=======
                    posts.map(function(post) {
                        post.hint = parseHintFromContentString(post.content)
                        post.content = marked(post.content)
                    })
                    res.json(posts)
                }
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
            })
        }
    })
})

app.get('/api/v1/post/:id', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).json(Error(522, req.path))
            console.error(err)
        } else {
            db.collection('Posts').findOne({
                _id: new ObjectID(req.params.id)
            }, function(err, post) {
                if (err) {
                    res.status(578).json(Error(578, req.path))
                    console.error(err)
                } else {
                    res.json(post)
                }
<<<<<<< HEAD
                db.close()
=======
>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
            })
        }
    })
})

<<<<<<< HEAD
=======
function parseHintFromContentString(str) {
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

>>>>>>> 8f531cfd3b76ba66ea28cf81d551ba3dce998ef6
function Error(code, endpoint) {
    switch (code) {
        case 433:
            return {
                endpoint: endpoint,
                success: false,
                error: {
                    code: 433,
                    label: "Invalid Post ID",
                    body: "Supplied Post ID is not an ObjectID"
                }
            }
        case 522:
            return {
                endpoint: endpoint,
                success: false,
                error: {
                    code: 522,
                    label: "No Connection",
                    body: "Unable to establish connection to database"
                }
            }
        case 578:
            return {
                endpoint: endpoint,
                success: false,
                error: {
                    code: 578,
                    label: "Database Error",
                    body: "Unable to query the database"
                }
            }
        default:
            return {
                endpoint: endpoint,
                success: false,
                error: {
                    code: 500,
                    label: "Internal Server Error",
                    body: "Internal Server Error"
                }
            }
    }
}

var server = app.listen(process.env.PORT || 5000, function() {
    console.log("Listening at http://0.0.0.0:%d", server.address().port)
})
