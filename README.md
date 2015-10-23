# Zipf
[Zipf](https://youtu.be/fCn8zs912OE) is a blogging system written in python, using Flask and MongoDB. To see an example of this system, see my personal [blog](https://cryptoc1.github.io).

**THIS IS A BETA AND MAY BREAK EASILY**


## Setup
Currently, Zipf is designed to be a server-side api, which can take requests from clients for posts. This is probably pretty backwards, and will most likely be reimplemented later on.
Zipf is designed in two parts: a *Reader*, and a *Writer*.

The *Reader* takes REST-like requests and returns post data. The *Reader* is meant to be deployed on a service like Heroku, or dependently if desired. The *Reader* is meant to access a Mongo Database with a read-only user.

**TLDR:** The *Reader* can run separately from the client, only accepts GET requests, and makes DB requests on behalf of a read-only DB user.

The *Writer* runs locally on your machine. Only the writer should be capable of making POST requests to the database through a dedicated "writer" db user. The *Writer* has many options that allow you to manage the database and and posts. It was designed to work similarly to `git`.

**TLDR:** The *Writer* runs locally on your machine to manage the blog.

More information can be found in `DOC.md`.


## TODO
- [ ] Logger class for the *Reader*
- [ ] Replace some existing logic with try/except statements for better error control
- [ ] Improve the docs
- [ ] Refactor EVERYTHING
        * Make more portable
        * Improve efficiency
- [ ] :tear: Ajax.. :crying:
- [ ] Make some "Zipf Header" parameters optional
- [ ] Add sort parameters to the endpoints
- [ ] Additional endpoints (`/api/v1/posts/tag/<tag>`)
- [ ] Better CORS Header management

##### As always, please open issues and make pull requests.
