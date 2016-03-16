var express = require('express'),
    handlebars = require('express-handlebars'),
    dotenv = require('dotenv'),
    marked = require('marked'),
    app = express()

var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    ObjectID = mongo.ObjectID

dotenv.config()

var url = process.env.REMOTE_URI

app.use(express.static('public'))

app.engine('handlebars', handlebars({
    defaultLayout: 'default'
}))
app.set('view engine', 'handlebars')

app.get('/', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).render('index', {
                endpoint: "Samuel Steele",
                error: Error(522, req.path)
            })
        } else {
            db.collection('posts').find().sort({
                "date.created": 1
            }).limit(10).toArray(function(err, posts) {
                if (err) {
                    res.status(578).render('index', {
                        endpoint: "Samuel Steele",
                        error: Error(578, req.path)
                    })
                } else {
                    res.render('index', {
                        endpoint: "Samuel Steele",
                        posts: posts
                    })
                }
            })
        }
    })
    res.render('index', {
        endpoint: 'Samuel Steele',
        posts: '',
        count: ''
    })
})

app.get('/post/:id', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).render('post', {
                endpoint: 'Post',
                error: Error(522, req.path)
            })
            console.error("Unable to connect to MongoDB: ", err)
        } else {
            db.collection('posts').findOne({
                _id: ObjectID(req.params.id)
            }, function(err, post) {
                if (err) {
                    res.status(578).render('post', {
                        endpoint: 'Post',
                        error: Error(578, req.path)
                    })
                } else {
                    res.render('post', {
                        endpoint: post.title,
                        content: marked(post.content)
                    })
                }
            })
        }
    })
})

app.get('/api/v1/posts', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).json({
                success: false,
                error: {
                    code: 522,
                    label: "No Connection",
                    body: "Unable to establish connection to database"
                }
            })
            console.error("Unable to connect to MongoDB: ", err)
        } else {
            db.collection('posts').find().toArray(function(err, posts) {
                if (err) {
                    res.status(578).json(Error(578, req.path))
                } else {
                    res.json(posts)
                }
            })
        }
    })
})

app.get('/api/v1/post/:id', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(522).json(Error(522, req.path))
            console.error("Unable to connect to MongoDB: ", err)
        } else {
            db.collection('posts').findOne({
                _id: new ObjectID(req.params.id)
            }, function(err, post) {
                if (err) {
                    res.status(578).json(Error(578, req.path))
                    console.error("Unable to search MongoDB: ", err)
                } else {
                    res.json(post)
                }
            })
        }
    })
})

function Error(code, endpoint) {
    switch (code) {
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
