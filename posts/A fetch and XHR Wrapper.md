start_zipf:
@title@ A fetch and XHR Wrapper
@author@ Samuel Steele
@email@ steelesam72@gmail.com
@tags@ js javascript xhr fetch ajax
end_zipf:

# A fetch and XHR Wrapper

The following code snippet is a simple wrapper for making AJAX requests. If fetch is available, then that is used. If not, XHR is used.

```javascript
window.request = function (url, callback, error) {
    if (window.fetch) {
        fetch(url).then(function (res) {
            if (res.status != 200) {
                console.error("Bad Request")
                error({
                    "text": res.statusText,
                    "code": res.status
                })
                return
            }
            res.text().then(function (data) {
                callback(data)
            })

        }).catch(function (err) {
            console.error("Fetch Error: " + err)
        })
    } else {
        // I fucking hate XHR so much...
        console.warn("If you're reading this, I don't know why the fuck you don't have a browser that supports fetch()")
        var xhr = new XMLHttpRequest()
        xhr.onload = function () {
            if (this.status != 200) {
                console.error("Bad Request")
                error({
                    "text": this.statusText,
                    "code": this.status
                })
                return
            }
            callback(this.responseText)
        }
        xhr.onerror = function (err) {
            error(err)
        }
        xhr.open('GET', url)
        xhr.send()
    }
}
```

I actually wrote this wrapper when working on this blog. Take note to the profanity in the wrapper. I feel strongly that XHR is disgusting and ugly, and that fetch is a far stronger and logical way of preforming AJAX requests.