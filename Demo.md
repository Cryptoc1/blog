@start_zipf
title:= Rewriting Zipf
author:= Samuel Steele
email:= steelesam72@gmail.com
tags:= demo, zipf, node, express
@end_zipf

# Rewriting Zipf
Over the past few weeks, I've been work a lot with node and express. I helped Josh with [cameron](https://github.com/trmml/cameron), and I've also had a few side projects that also involved node. After having doing so much work with node recently, I was somewhat appalled when I went back to look at some of the code that ran my [this very] blog. To Flask and python's credit, part of the disgust in the code was just a result of change in my coding style/ability. Nonetheless, I felt compelled that I could achieve a better blogging system using node and handlebars.

### The Big Ones
The main differences between the node version and the python version is: templating, new zipf-header syntax, and improved extensiblity.

###### Templates
Thanks to Handlebars easily configurable view hierarchy, it's much easier to enable the use of custom themes. To set up a custom theme, you can create a folder that represents the name of your theme. You can have whatever sub folders you'd like, but the minimum requirement is that your theme folder contains at least a `static/`, and a `views/` folder. The static folder can hold all of the css, javascript, or images your theme may require. The `views/` folder represents the original handlebars hierarchy, containing all your views, as well as a `layouts/` folder with a `default.handlebars` file. For an example of the directory hiearchy, you can look at the [repo](https://github.com/cryptoc1/zipf/tree/master/themes).

###### Zipf Header



better writer.js / post "parsing"
        + new zipf headers

hopefully more extensible




Talk about how github.com/cryptoc1/blog is a fork of this
