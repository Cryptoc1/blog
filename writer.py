#!/usr/bin/env python

import os, sys, re, time
import pymongo
import ConfigParser

_usage = "usage: zipf [options] \n\
config <key> <value> [-p]: Read (if -p is present) and set global configuration options \n\
    \tauthor <name> : Set the name of the default author for submitting posts to <author> \n\
    \temail <email> : Set the default author's email to <email> \n\
    help|-h : Print this help message \n\
init [-f]: Initialize the current directory as a Zipf \"repo\"\n\
    \t-f : If the .zipf directory already exists, overwrite it. \n\
read|-r [<key> <value>] : Dump the PostDB, or dump the Post where <key> matches <value> \n\
remote : Mange the remote Database\n\
\tset <url> <db-name>: Set the remote to <url> in format mongodb://<dbuser>:<dbpassword>@<host>/<database> with database <db-name>\n\
    \tget : Prints the current remote \n\
write|-w <post.md> : Write the Zipf flavored Markdown to the PostDB"

class GlobalConfig:
    '''
    The GlobalConfig is used for managing global configurations.
    '''
    def __init__(self):
        if not os.path.exists(os.path.expanduser("~/.zipf/zipf.cfg")):
            if not os.path.exists(os.path.expanduser("~/.zipf")):
                os.makedirs(os.path.expanduser("~/.zipf"))
            f = open(os.path.expanduser("~/.zipf/zipf.cfg"), "a")
            f.write("[user]\nauthor = None\nemail = None")
            f.close()
        self.config = ConfigParser.ConfigParser()
        self.config.read(os.path.expanduser("~/.zipf/zipf.cfg"))

    def set_author(self, name):
        '''
        Set the default author to <name>

        args:
            name : name of author
        '''
        self.config.set("user", "author", unicode(name))
        f = open(os.path.expanduser("~/.zipf/zipf.cfg"), "wb")
        self.config.write(f)
        f.close()

    def get_author(self):
        '''
        Gets the default author
        '''
        return self.config.get("user", "author")

    def set_email(self, address):
        '''
        Set the default email to <address>

        args:
            address : email address of author
        '''
        self.config.set("user", "email", unicode(address))
        f = open(os.path.expanduser("~/.zipf/zipf.cfg"), "wb")
        self.config.write(f)
        f.close()

    def get_email(self):
        '''
        Gets the default email
        '''
        return self.config.get("user", "email")

class RepoConfig:
    '''
    The RepoConfig class is used for interacting repo level configuration.
    '''
    def __init__(self):
        if not os.path.exists(os.getcwdu() + "/.zipf/zipf.cfg"):
            if not os.path.exists(os.getcwdu() + "/.zipf"):
                os.makedirs(os.getcwdu() + "/.zipf")
            f = open(os.getcwdu() + "/.zipf/zipf.cfg", "a")
            f.write("[user]\nauthor = None\nemail = None")
            f.close()
        self.config = ConfigParser.ConfigParser()
        self.config.read(os.getcwdu() + "/.zipf/zipf.cfg")

    def set_remote(self, url, db):
        '''
        Sets the repo's remote to <url> with remote <db>

        args:
            url : The url of the new remote
            db : Name of database located at <url>
        '''
        self.config.set("repo", "remote", str(url + " " + db))
        f = open(os.getcwdu() + "/.zipf/zipf.cfg", "wb")
        self.config.write(f)
        f.close()

    def get_remote(self):
        '''
        Gets the repo's current remote.
        '''
        return self.config.get("repo", "remote").split()

class MarkdownParser:
    def __init__(self, path):
        '''
        Initializes a MarkdownParser for file in path <path>.
        '''
        self.path = path
        f = open(path, "r")
        self.post = f.read().strip()
        f.close()
        self.header_needs_parsing = True

    def parse_header(self):
        '''
        Extracts information about a post from the start_zipf:\end_zipf: declarations
        '''
        if self.header_needs_parsing:
            rheader = self.post[0:self.post.index("end_zipf") + 9]
            rheader = rheader.split('\n')
            rheader.pop(0)
            rheader.pop(len(rheader)-1)

            self.header = {}
            for atr in rheader:
                key = atr.split()[0].replace("@", "")
                values = atr.strip()
                value = re.sub("(\@[A-z]*\@).", "", values)
                self.header[key] = value
            self.header["tags"] = self.header["tags"].split()
            self.header_needs_parsing = False
        return self.header

    def trim_header(self):
        '''
        Removes the zipf header from the post content.
        '''
        end = self.post.index('end_zipf:') + 9
        self.post = self.post[end:].strip()

class Remote:
    def __init__(self):
        '''
        Initializes a Remote object, which is used for interacting with Mongo DBs.
        '''
        try:
            # self.client = pymongo.MongoClient("mongodb://blog-writer:%40Livelifetillde4th@ds047732.mongolab.com:47732/heroku_8k9pzb1d")
            r = RepoConfig().get_remote()
            self.client = pymongo.MongoClient(r[0])
            self.db = self.client[r[1]]
            self.Posts = self.db.Posts
        except Exception as e:
            print "Unable to establish connection to remote. System returned: "
            print type(e)
            print e
            sys.exit(-1)

    def push(self, post):
        '''
        Push (write|-w) content to the db

        args:
            post : a Properly formatted post object to be directly inserted into the database.
        '''
        insert = None
        try:
            insert = self.Posts.insert_one(post)
        except Exception as e:
            insert = e
            print "Unable to push content to remote. System returned: "
            print type(e)
            print e

        if type(insert) == pymongo.results.InsertOneResult:
            return True
        else:
            return False

    def pull(self, key, value, all=False):
        '''
        Pull (read|-r) cotent from the database where <key> equals <value>

        args:
        '''
        if all:
            return self.Posts.find_one()
        else:
            return self.Posts.find_one({key: value})

def init_dir(force=False):
    '''
    Initializes the current working directory as a Zipf directory.
    '''
    if os.path.exists(os.getcwdu() + "/.zipf") and not force:
        print "Zipf repo already created, use `zipf init -f` to force overwrite."
    elif force:
        os.remove(os.getcwdu() + "/.zipf/zipf.cfg")
        os.rmdir(os.getcwdu() + "/.zipf")
        os.makedirs(os.getcwdu() + "/.zipf")
        f = open(os.getcwdu() + unicode("/.zipf/zipf.cfg"), "a")
        f.write("[repo]\nremote = None")
        f.close()
    else:
        os.makedirs(os.getcwdu() + "/.zipf")
        f = open(os.getcwdu() + unicode("/.zipf/zipf.cfg"), "a")
        f.write("[repo]\nremote = None")
        f.close()

def argument_parser():
    '''
    Preforms logic for program arguments
    '''
    if sys.argv[1] == "init":
        force = False
        if len(sys.argv) == 3:
            if sys.argv[2] == "-f":
                force = True
        init_dir(force)
    if sys.argv[1] == "config":
        if len(sys.argv) < 4:
            print "Missing key or value"
            sys.exit()
        elif "-p" in str(sys.argv):
            key = sys.argv[2]
            gconfig = GlobalConfig()
            if key == "author":
                print gconfig.get_author()
            if key == "email":
                print gconfig.get_email()
        elif "-p" not in str(sys.argv):
            key = sys.argv[2]
            value = sys.argv[3]
            gconfig = GlobalConfig()
            if key == "author":
                gconfig.set_author(value)
            if key == "email":
                gconfig.set_email(value)
    if sys.argv[1] == "write" or sys.argv[1] == "-w":
        if sys.argv[2]:
            gconfig = GlobalConfig()
            md = MarkdownParser(sys.argv[2])
            header = md.parse_header()
            md.trim_header()
            post = {"date": {}}
            if not header["author"]:
                post["author"] = gconfig.get_author()
            else:
                post["author"] = header["author"]
            if not header["email"]:
                post["email"] = gconfig.get_email()
            else:
                post["email"] = header["email"]
            if header["tags"]:
                post["tags"] = header["tags"]
            post["title"] = header["title"]
            post["content"] = md.post
            post["date"]["created"] = time.time()
            post["date"]["edited"] = time.time()
            remote = Remote()
            remote.push(post)
        else:
            print "usage: zipf write|-w file.md"
            sys.exit()
    if sys.argv[1] == "read" or sys.argv[1] == "-r":
        if len(sys.argv) == 2:
            remote = Remote()
            res = remote.pull(None, None, all=True)
            for i in res:
                print unicode(i) + unicode(": ") + unicode(res[i])
        elif len(sys.argv) == 4:
            remote = Remote()
            res = remote.pull(sys.argv[2], sys.argv[3])
            for i in res:
                print unicode(i) + unicode(": ") + unicode(res[i])
        else:
            print "usage: zipf read|-r <key> <value>"
    if sys.argv[1] == "remote":
        if len(sys.argv) > 2:
            if sys.argv[2] == "set":
                if len(sys.argv) == 5:
                    rconfig = RepoConfig()
                    rconfig.set_remote(sys.argv[3], sys.argv[4])
                else:
                    print "usage: zipf remote set <url> <database>"
            if sys.argv[2] == "get":
                rconfig = RepoConfig()
                print rconfig.get_remote()
        else:
            print "usage: zipf remote set <url>"
            sys.exit()

if __name__ == "__main__":
    # Let's GOOOOOOOO!
    if not os.path.exists(os.path.expanduser("~/.zipf/zipf.cfg")):
        if len(sys.argv) > 1:
            if sys.argv[1] == "help" or sys.argv[1] == "-h":
                print _usage
                sys.exit()
            if sys.argv[1] == "config":
                argument_parser()
        print "Global configuration not set. Use `config` to configure Zipf."
        sys.exit()
    if len(sys.argv) < 2:
        print _usage
    elif sys.argv[1] == "-h" or sys.argv[1] == "help":
        print _usage
    else:
        argument_parser()
