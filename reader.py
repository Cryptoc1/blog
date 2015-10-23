#!/usr/bin/env python

import os, sys, json, ast
import pymongo
from flask import *
from flask.ext.cors import CORS
import ConfigParser
from bson.objectid import ObjectId

class Remote:
    def __init__(self):
        if not os.path.exists(os.getcwdu() + "/reader.cfg"):
            ##
            #  Put a real link to the DOCs here
            ##
            print "reader.cfg does not exist. This file is required, see https://github.com/cryptoc1/zipf/master/DOC.md"
            sys.exit(1)
        else:
            try:
                self.config = ConfigParser.ConfigParser()
                self.config.read(os.getcwdu() + "/reader.cfg")
                r = self.get_remote()
                self.client = pymongo.MongoClient(r[0])
                self.db = self.client[r[1]]
                self.Posts = self.db.Posts
            except Exception as e:
                print "Unable to establish connection to remote. System returned: "
                print type(e)
                print e
                sys.exit(-1)

    def get_remote(self):
        return self.config.get('repo', 'remote').split()

app = Flask(__name__)
app.secret_key = "temp-key"
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})
remote = Remote()

@app.route("/", methods=["GET"])
def index():
    return redirect("https://cryptoc1.github.io")

@app.route("/api/v1/posts", methods=["GET"])
def all_posts():
    '''
    Returns <limit> number of posts, after <offset>. Queries of such matter are always sorted by an object's date property.

    REST parameters:
        ?offset=<int>&limit=<int>
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
                    limit = 100
                else:
                    limit = int(request.args.get('limit'))
                ret = []
                for res in remote.Posts.find().sort("date.created", -1).skip(offset).limit(limit):
                    res["_id"] = str(res["_id"])
                    ret.append(json.dumps(res))
                for i, j in enumerate(ret):
                    ret[i] = ast.literal_eval(j)
                return str(ret)
        except Exception as e:
            print "Unable to establish connection to remote. System returned: "
            print type(e)
            print e
            return "500: Internal Server Error"
    else:
        return "405: Method Not Allowed"

@app.route("/api/v1/posts/id/<post_id>", methods=["GET"])
def id(post_id):
    if request.method == "GET":
        if not remote.Posts.find_one({"_id": ObjectId(post_id)}):
            return "404: Not Found"
        else:
            if post_id == "" or post_id == None or post_id == "null" or len(post_id) < 24:
                return "400: Bad Request"
            else:
                res = remote.Posts.find_one({"_id": ObjectId(post_id)})
                res["_id"] = str(res["_id"])
                return str(json.dumps(res))
    else:
        return "405: Method Not Allowed"


@app.route("/api/v1/posts/author/<author>", methods=["GET"])
def author(author):
    '''
    Returns any posts by <author>

    REST args:
        author : str for author


    REST parameters:
        ?[sort=<key>][limit=<limit>][offset=offset]
    '''
    if request.method == "GET":
        try:
            if remote.Posts.find({"author": author}).count() < 0:
                return "404: Not Found.\nNo entries by author: " + unicode(author)
            else:
                if request.args.get('offset') == None:
                    offset = 0
                else:
                    offset = int(request.args.get('offset'))
                if request.args.get('limit') == None:
                    limit = 15
                else:
                    limit = int(request.args.get('limit'))
                ret = []
                for res in remote.Posts.find({"author": author}).sort("date.created", -1).skip(offset).limit(limit):
                    ret.append(res)
                return str(ret)
        except Exception as e:
            print "Unable to establish connection to remote. System returned: "
            print type(e)
            print e
            return "500: Internal Server Error"
    else:
        return "405: Method Not Allowed"

###
#
#   "Extra" endpoints for getting info about the db
#   TODO:
#     + Add some cool data stuff like averages on posts by authors and stuff
#
###

@app.route("/api/v1/ext/posts/count")
def post_count():
    '''
    Returns the number of entries in the Posts db
    '''
    if request.method == "GET":
        try:
            return str(remote.Posts.count())
        except Exception as e:
            print "Unable to establish connection to remote. System returned: "
            print type(e)
            print e
            return "500: Internal Server Error"
    else:
        return "405: Method Not Allowed"

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
