@start_zipf
title := Rewriting Zipf
author := Samuel Steele
email := steelesam72@gmail.com
tags := demo, zipf, node, express
@end_zipf

# Rewriting Zipf
Over the past few weeks, I've been work a lot with node and express. I helped Josh with [cameron](https://github.com/trmml/cameron), and I've also had a few side projects that also involved node. After having doing so much work with node recently, I was somewhat appalled when I went back to look at some of the code that ran my [this very] blog. To Flask and python's credit, part of the disgust in the code was just a result of change in my coding style/ability. Nonetheless, I felt compelled that I could achieve a better blogging system using node and handlebars.

## The Big Ones
The main differences between the node version and the python version is: templating, new zipf-header syntax, and improved extensiblity.

### Templates
Thanks to Handlebars easily configurable view hierarchy, it's much easier to enable the use of custom themes. To set up a custom theme, you can create a folder that represents the name of your theme. You can have whatever sub folders you'd like, but the minimum requirement is that your theme folder contains at least a `static/`, and a `views/` folder. The static folder can hold all of the css, javascript, or images your theme may require. The `views/` folder represents the original handlebars hierarchy, containing all your views, as well as a `layouts/` folder with a `default.handlebars` file. For an example of the directory hierarchy, you can look at the [repo](https://github.com/cryptoc1/zipf/tree/master/themes).

### Zipf Header
With the node version, I had the insight and accessibility to make a more logical syntax for the zipf header. An example of the previous syntax is below, followed by the same example, but using the new syntax.

#### Previous Syntax
```
start_zipf:
@title@ Rewriting Zipf
@author@ Samuel Steele
@email@ steelesam72@gmail.com
@tags@ demo zipf node express
end_zipf:
```

#### The New Syntax
```
@start_zipf
title := Rewriting Zipf
author := Samuel Steele
email := steelesam72@gmail.com
tags := demo, zipf, node, express
@end_zipf
```

As you can see, the original syntax was much more cluttered and more difficult to quickly go, "Oh, this is what that means." Let's take a moment to talk about some of the specifics of the new syntax. To begin, the `start_zipf` and `end_zipf` markers are now prefixed with an ampersat (`@`), rather than suffixed with a colon (`:`). Rather than prefixing and suffixing properties with an ampersat (`@`), the properties can be suffixed with, or followed by, a colon-equals combination (`:=`, like in Go or Pascal).

Because of the changes to the zipf header syntax, the parser in `writer.js` is much more concise than the one from `writer.py`. Part of the reason is that the parser is a bit more configurable, thanks to the awesome power of JSON, you can set whether or not you want to enable post hints, whether or not you want to insert HTML over Markdown, and a few other smaller things. (**NOTE**: changing preferences like `useHints`, or `convertMarkdown`, could easily break your deployment's UI). From a programming aspect, JavaScript's prototyping also made it easier to create cleaner classes than what I had in Python. Overall, the simpler classes, and more concise code made `writer.js` generally more extensible and easier to use than `writer.py`.

## A Live Example
If you're yet to be impressed by Zipf as a good project, you should know that this very blog is a fork of the original project. If you want to take a look for yourself, you can checkout this blog's [fork](https://github.com/cryptoc1/blog), or the [original project](https://github.com/cryptoc1/zipf) on GitHub.
