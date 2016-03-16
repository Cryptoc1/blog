window.location.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// For selecting our <data> tags
document.getDataElementByDataId = function(dataId) {
    var dataElements = document.getElementsByTagName('data')
    for (var i = 0; i < dataElements.length; i++) {
        if (dataElements[i].getAttribute('data-id') == dataId) {
            dataElements[i].evalValue = eval('(' + dataElements[i].textContent + ')')
            return dataElements[i]
        }
    }
}

// Wrapper for fetch() and XHR
window.request = function(url, callback, error) {
    if (window.fetch) {
        fetch(url).then(function(res) {
            if (res.status != 200) {
                console.error("Bad Request")
                error({
                    "text": res.statusText,
                    "code": res.status
                })
                return
            }
            res.text().then(function(data) {
                callback(data)
            })

        }).catch(function(err) {
            console.error("Fetch Error: " + err)
        })
    } else {
        // I fucking hate XHR so much...
        console.warn("If you're reading this, I don't know why the fuck you don't have a browser that supports fetch()")
        var xhr = new XMLHttpRequest()
        xhr.onload = function() {
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
        xhr.onerror = function(err) {
            error(err)
        }
        xhr.open('GET', url)
        xhr.send()
    }
}


/*

    Custom functions

*/

function makePostDOMElement(post) {
    /*
     <a class="post" href="">
        <span class="post-title"></span>
        <span class="post-date"></span>
        <div class="post-hint"></div>
    </a>
    */
    var a = document.createElement('a');
    a.className = 'post'
    a.href = '/post/' + post._id
    a.setAttribute('data-id', post._id)
    a.setAttribute('data-tags', post.tags)
    a.innerHTML = "<span class=\"post-title\">" + post.title + "</span><span class=\"post-date\">" + parseDate(parseInt(post.date.created)) + "</span><div class=\"post-hint\">" + post.hint + "</div>"
    document.getElementById('content').appendChild(a)
}

function parseDate(seconds) {
    var date = new Date(seconds * 1000)
    return ["Jan ", "Feb ", "Mar ", "Apr ", "May ", "Jun ", "Jul ", "Aug ", "Sep ", "Oct ", "Nov ", "Dec "][date.getMonth()] + date.getDate() + ", " + date.getFullYear();
}
