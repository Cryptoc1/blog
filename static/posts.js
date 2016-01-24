window.onload = function () {
    var data = document.getDataElementByDataId('posts').evalValue
    data.map(makePostDOMElement)
    if (document.getElementById('content').children.length >= parseInt(document.getDataElementByDataId('count').evalValue)) {
        contentLoader.style.animationName = ''
        contentLoader.style.visibility = 'hidden'
    }


    /*
        I don't have enough posts to test this... :(
    */
    // When the page loads, start fetching all posts, "cache" them, and add them to #content
    var posts = []
    window.request('/api/v1/posts?offset=10', function (data) {
        data = eval('(' + data + ')')
        data.map(function (post) {
            posts.push(post)
        })
    }, function (err) {
        console.log(err)
    })

    document.getElementById('search-box').onkeyup = function (e) {
        console.log(e)
    }
}