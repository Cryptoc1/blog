window.onload = function () {
    var data = parseData()
    data.map(makePostDOMElement)
}

function makePostDOMElement(post) {
    /*
     <a class="post" href="post.html">
        <span class="post-title">Post One</span>
        <span class="post-date">Jan 18, 2016</span>
        <div class="post-hint">So, today I updated my blog. I'm hoping that the new form will look nicer than before. I tried going for a more min...</div>
    </a>
    */
    var a = document.createElement('a');
    a.className = 'post'

    // CHANGE ME
    a.href = window.location.host + '/post/' + post._id + '?ref=' + window.location
    a.innerHTML = "<span class=\"post-title\">" + post.title + "</span><span class=\"post-date\">" + parseDate(parseInt(post.date.created)) + "</span><div class=\"post-hint\">" + parseHintFromContentString(post.content) + "</div>"
    document.getElementById('content').appendChild(a)
}

function parseDate(seconds) {
    var date = Date(seconds * 1000).split(" ");
    return date[1] + " " + date[2] + ", " + date[3];
}

function parseHintFromContentString(str) {
    var substr = str.substring(str.indexOf('\n'), str.indexOf('\n', str.indexOf('\n') + 1)).replace('\n', '')
    if (substr.length > 300)
        substr = substr.substring(0, 300)
    return substr + "..."
}

function parseData() {
    return eval('(' + document.getElementsByTagName('data')[0].textContent + ')')
}