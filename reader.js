var express = require('express'),
    handlebars = require('express-handlebars'),
    dotenv = require('dotenv'),
    app = express()

var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    ObjectID = mongo.ObjectID

var zipf = require('./lib/zipf.js')
zipf.init()

dotenv.config()

var url = process.env.REMOTE_URI || zipf.remote

app.use(express.static(zipf.staticPath))
app.use(express.static('public'))

app.set("views", zipf.themePath + "/views/")
app.engine('handlebars', handlebars({
    layoutsDir: zipf.themePath + "/views/layouts/",
    defaultLayout: 'default'
}))
app.set('view engine', 'handlebars')

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
                    collection.count(function(err, count) {
                        if (err) {
                            console.error(err)
                        } else {
                            var showLoader = false
                            if (posts.length < count) {
                                showLoader = true
                            }
                            res.render('index', {
                                title: "Samuel Steele",
                                count: count,
                                posts: posts,
                                showLoader: showLoader
                            })
                        }
                        db.close()
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
                            title: post.title,
                            post: post
                        })
                    }
                    db.close()
                })
            }
        }
    })
})

app.get('/resume', function(res, res) {
    res.render('resume')
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
                    res.json(posts)
                }
                db.close()
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
                db.close()
            })
        }
    })
})

function Error(code, title) {
    switch (code) {
        case 433:
            return {
                title: title,
                success: false,
                error: {
                    code: 433,
                    label: "Invalid Post ID",
                    body: "Supplied Post ID is not an ObjectID"
                }
            }
        case 522:
            return {
                title: title,
                success: false,
                error: {
                    code: 522,
                    label: "No Connection",
                    body: "Unable to establish connection to database"
                }
            }
        case 578:
            return {
                title: title,
                success: false,
                error: {
                    code: 578,
                    label: "Database Error",
                    body: "Unable to query the database"
                }
            }
        default:
            return {
                title: title,
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
