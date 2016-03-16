window.onload = function () {
    var data = document.getDataElementByDataId('post').evalValue
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value
        }
    })
    document.getElementById('post').children[0].innerHTML = marked(data.content)

    // Uncomment to enable tags
    /*var d = document.createElement('div');
    d.className = "tags";
    for (i in data.tags) {
        var a = document.createElement('a');
        a.href = "/tag/" + data.tags[i]
        a.innerHTML = data.tags[i];
        d.appendChild(a);
    }*/
    document.getElementById('post').appendChild(d);
    document.title = data.title
}