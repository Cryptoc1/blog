function loadMorePosts() {
    var contentLoader = document.querySelector('.content-loader')
    contentLoader.style.animationName = 'contentLoaderSpinAnimation'
    window.request("/api/v1/posts?offset=" + document.getElementById('content').children.length, function(data) {
        data = eval('(' + data + ')')
        data.map(makePostDOMElement)
        if (document.getElementById('content').children.length >= parseInt(document.getDataElementByDataId('count').evalValue)) {
            contentLoader.style.animationName = ''
            contentLoader.style.visibility = 'hidden'
        }
    }, function(err) {
        console.error("Caught bad request when attempting to make a request: ", err)
        document.getElementById('content').innerHTML = "<style>._error {visibility: hidden;}</style><div class=\"error\">There was an error loading the posts.<div>Please reload the webpage, or checkback later.</div><div>(" + err.code + "::" + err.text + ")</div></div>"
    })
}
