#!/usr/bin/env python

import os, sys, json, ast
import pymongo
from flask import *
from bson.objectid import ObjectId

_version = "1.0.0b"

class Remote:
    def __init__(self):
        try:
            uri = os.environ["REMOTE_URI"]
            self.client = pymongo.MongoClient(uri)
            self.db = self.client[uri[uri.rfind('/') + 1:]]
            self.Posts = self.db.Posts
        except Exception as e:
            print "Unable to establish connection to remote. System returned: "
            print type(e)
            print e
            sys.exit(-1)

app = Flask(__name__)
remote = Remote()

@app.route("/", methods=["GET"])
def index():
    try:
        posts = []
        for res in remote.Posts.find().sort("date.created", -1).limit(10):
            res["_id"] = str(res["_id"])
            posts.append(json.dumps(res))
        for i, j in enumerate(posts):
            posts[i] = ast.literal_eval(j)

        count = remote.Posts.count()
        return render_template('index.html', posts=posts, count=count)
    except Exception as e:
        print type(e)
        print e
        return render_template('index.html', error="There was an error loading posts.")

'''TODO
@app.route("/posts")
def posts():
    try:
        if remote.Posts.count() < 1:
            return "404: Not Found\nNo entries."
        else:
            if request.args.get('offset') == None:
                offset = 0
            else:
                offset = int(request.args.get('offset'))
            if request.args.get('limit') == None:
                limit = 100
            else:
                limit = int(request.args.get('limit'))
            ret = []
            for res in remote.Posts.find().sort("date.created", -1).limit(25):
                res["_id"] = str(res["_id"])
                ret.append(json.dumps(res))
            for i, j in enumerate(ret):
                ret[i] = ast.literal_eval(j)
            return render_template('cryptoc1/posts.html', posts=ret)
    except Exception as e:
        print e
        return redirect(url_for('error'))
'''

@app.route("/post/<post_id>", methods=["GET"])
def post(post_id):
    try:
        res = remote.Posts.find_one({"_id": ObjectId(post_id)})
        res["_id"] = str(res["_id"])
        res = ast.literal_eval(json.dumps(res))
        return render_template('post.html', post=res)
    except Exception as e:
        print type(e)
        print e
        return render_template('post.html', error="There was an error loading post.")

'''TODO
@app.route("/tag/<tag>", methods=["GET"])
def tag():
    pass
'''

##
#
#   API REST Endpoints
#
##

def crossorigin(ret):
    resp = make_response(str(ret))
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp

@app.route("/api/v1/posts", methods=["GET", "OPTIONS"])
def all_posts():
    '''
    Returns <limit> number of posts, after <offset>. Queries of such matter are always sorted by an object's date property.

    REST parameters:
        ?offset=<int>?limit=<int>
    '''
    if request.method == "GET":
        try:
            if remote.Posts.count() < 1:
                return "404: Not Found\nNo entries."
            else:
                if request.args.get('offset') == None:
                    offset = 0
                else:
                    offset = int(request.args.get('offset'))
                if request.args.get('limit') == None:
                    limit = 10
                else:
                    limit = int(request.args.get('limit'))
                ret = []
                for res in remote.Posts.find().sort("date.created", -1).skip(offset).limit(limit):
                    res["_id"] = str(res["_id"])
                    ret.append(json.dumps(res))
                for i, j in enumerate(ret):
                    ret[i] = ast.literal_eval(j)
                return crossorigin(ret)
        except Exception as e:
            print "Unable to establish connection to remote. System returned: "
            print type(e)
            print e
            return "500: Internal Server Error", 500
    else:
        return "405: Method Not Allowed", 405


@app.route("/api/v1/post/<post_id>", methods=["GET", "OPTIONS"])
def post_by_id(post_id):
    if request.method == "GET":
        if not remote.Posts.find_one({"_id": ObjectId(post_id)}):
            return "404: Not Found", 404
        else:
            if post_id == "" or post_id == None or post_id == "null" or len(post_id) < 24:
                return "400: Bad Request", 400
            else:
                res = remote.Posts.find_one({"_id": ObjectId(post_id)})
                res["_id"] = str(res["_id"])
                crossorigin(ret)
    else:
        return "405: Method Not Allowed", 405

if __name__ == "__main__":
    app.run(debug=True)
