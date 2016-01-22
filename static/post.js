window.onload = function () {
    var data = document.getDataElementByDataId('post').evalValue
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value
        }
    })
    document.getElementById('post').children[0].innerHTML = marked(data.content)

    // Uncomment to enable tags
    /* var d = document.createElement('div');
    d.className = "tags";
    for (i in data.tags) {
        var a = document.createElement('a');
        a.href = "//cryptoc1.github.io/tags/index.html?tag=" + data.tags[i]
        a.innerHTML = data.tags[i];
        d.appendChild(a);
    }
    document.getElementById('post').appendChild(d);*/
    document.title = data.title
    document.getElementById('ref-btn').innerHTML = "<a href=\"/\"><span class=\"fa fa-home\"></span></a>"
    document.getElementsByTagName('footer')[0].innerHTML = "<a href=\"/\" class=\"fa fa-copyright\">Samuel Steele</a>"
}