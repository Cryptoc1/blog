# Zipf
[Zipf](https://youtu.be/fCn8zs912OE) is the software I wrote to run my blog. 

It is a two-part software as a whole. The *reader* is the server that is meant to be ran from a Heroku deployment. It has a few different endpoints,
and is pretty simple for what you woud expect of a flask app. The *writer* is ran on my local machine for manipulating the posts database, mainly 
inserting documents.


## TODO
- [ ] Improve the docs
- [ ] Refactor EVERYTHING
        * Make more portable
        * Improve efficiency
- [x] :cry: Ajax.. :cold_sweat:
- [ ] Make some "Zipf Header" parameters optional
