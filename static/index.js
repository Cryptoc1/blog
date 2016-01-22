var contentLoader = document.querySelector('.content-loader')

window.onload = function () {
    var data = document.getDataElementByDataId('posts').evalValue
    data.map(makePostDOMElement)
    if (document.getElementById('content').children.length >= parseInt(document.getDataElementByDataId('count').textContent)) {
        contentLoader.style.animationName = ''
        contentLoader.style.visibility = 'hidden'
    }
}

function loadMorePosts() {
    contentLoader.style.animationName = 'contentLoaderSpinAnimation'
    window.request("/api/v1/posts?offset=" + document.getElementById('content').children.length, function (data) {
        data = eval('(' + data + ')')
        data.map(makePostDOMElement)
        if (document.getElementById('content').children.length >= parseInt(document.getDataElementByDataId('count').textContent)) {
            contentLoader.style.animationName = ''
            contentLoader.style.visibility = 'hidden'
        }
    }, function (err) {
        console.error("Caught bad request when attempting to make a request: ", err)
        document.getElementById('content').innerHTML = "<style>._error {visibility: hidden;}</style><div class=\"error\">There was an error loading the posts.<div>Please reload the webpage, or checkback later.</div><div>(" + err.code + "::" + err.text + ")</div></div>"
    })
}


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
    a.innerHTML = "<span class=\"post-title\">" + post.title + "</span><span class=\"post-date\">" + parseDate(parseInt(post.date.created)) + "</span><div class=\"post-hint\">" + parseHintFromContentString(post.content) + "</div>"
    document.getElementById('content').appendChild(a)
}

function parseDate(seconds) {
    var date = new Date(seconds * 1000)
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function parseHintFromContentString(str) {
    var substr = str.substring(str.indexOf('\n'), str.indexOf('\n', str.indexOf('\n') + 1)).replace('\n', '')
    if (substr.length > 300)
        substr = substr.substring(0, 300)
    return substr + "..."
}