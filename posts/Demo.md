@start_zipf
title := Code Highlighting Test
author := Samuel Steele
email := steelesam72@gmail.com
tags := demo, test, zipf
@end_zipf

# Code Highlighting Test

This post is a test for my implementation of highlight.js with marked.js.

```python
#!/usr/bin/env python

import os, sys

# this code snippet is literally python lorem ipsum

def foo(x, y):
    return (str(x), str(y))

if __name__ == "__main__":
    if True:
        print foo(1, 2)
    else:
        sys.exit(-1)

```
