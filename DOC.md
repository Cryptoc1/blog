# Zipf Documentation
The following document is meant to serve as a documentation for the Zipf "Framework". Combined, the following sections recommend how the services should be configured for ideal use, serve as "man pages" for the different utilities, and explain different standards and formats defined for use with Zipf.


## The *Reader*
The *Reader* is the server-side program that runs an api for interacting with the MongoDB holding a collection of *Posts*. The *Reader* should be configured with a database user that has both read-only permissions.

#### Configuring the *Reader*
@TODO

#### *Reader* API
@TODO


## The *Writer*
The *Writer* is used to push posts, in the form of Markdown files, to the database. The *Writer* is distributed in this "package" as the command line tool `zipf`. `zipf` comes with many options, and works similarly to `git`. The output of `zipf help` is included below.
```
usage: zipf [options]
config <key> <value> [-p]: Read (if -p is present) and set global configuration options
    	author <name> : Set the name of the default author for submitting posts to <author>
    	email <email> : Set the default author's email to <email>
    help|-h : Print this help message
init [-f]: Initialize the current directory as a Zipf "repo"
    	-f : If the .zipf directory already exists, overwrite it.
read|-r [<key> <value>] : Dump the PostDB, or dump the Post where <key> matches <value>
remote : Mange the remote Database
	set <url> <db-name>: Set the remote to <url> in format mongodb://<dbuser>:<dbpassword>@<host>/<database> with database <db-name>
    	get : Prints the current remote
write|-w <post.md> : Write the Zipf flavored Markdown to the PostDB
```

#### Installing the *Writer*
After you download or clone this repo, run the following command:
```
$ chmod +x writer.py; sudo cp writer.py /bin/zipf
```
If you're on El Capitan, write protection is write protection is enabled on root directories, so you may want to try copying the script into a different folder. For example: `/usr/local/bin/`. If you receive any strange errors, edit the hashbang declaration on the first line of `writer.py`, then trying again.

#### Markdown Flavoring (a.k.a: Zipf Headers)
When you write a blog post, you write in markdown on your local machine. Using `zipf`, the *Writer* utility, the post gets pushed to the database and thus
push to the blog. However, the *Writer* needs to know some information about the post before it can push to the database. That's where the "Zipf Header" comes in. The "Zipf Header" is used to define the author, the (author's) email, the title, and the tags associated with a post. At the moment, all of these header items are required. Below is an example from `Demo.md`.
```
start_zipf:
@title@ Demo Post
@author@ Samuel Steele
@email@ steelesam72@gmail.com
@tags@ demo test zipf
end_zipf:

...
```
Notes:
    * The `start_zipf:` line **MUST** by on line 0 (the first).
    * `@tags@` should be a space separated list different, single-word tags.


## Models

#### Post Model
Note that some fields have been simplified for readability.

```json
{
    "author": "Samuel Steele",
    "title": "Demo Post",
    "tags": ["demo", "test", "zipf"],
    "content": "# Demo Post\nThis post is meant to serve as a demo post for the Zipf blogging framework.\nZipf supports all sorts of cool Markdown stuff, so have fun.\n\n# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n\nThis is an example of an `inline` code snippet.\n\n```\n# And this an example of a large block code\n# Hopefully, I can add code highlighting to the MD parser.\n\ndef parse_markdown(file):\n    pass\n    \n```\n\nOr, if you're not much of a coder and more of a blogger, there's also cool stuff like **BOLDS** and *Italics*.\n\nHere's a link to a YouTube [video](https://youtu.be/fCn8zs912OE).",
    "date": {
        "edited": "1445557542.085373",
        "created": "1445557542.085373"
    },
    "_id": "ObjectId(\"56297526da7141cede08853c\")",
    "email": "steelesam72@gmail.com"
}
```
