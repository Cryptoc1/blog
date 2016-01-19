window.onload = function () {
    var data = parseData()
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
        document.getElementById('post').appendChild(d);U/
        document.title = data.title
            /*if (getParameterByName('ref'))
                document.getElementById('ref-btn').innerHTML = "<a href=\"" + getParameterByName('ref') + "\"><span class=\"fa fa-chevron-left\"></span></a>"
            else*/

    // CHANGE ME!
    document.getElementById('ref-btn').innerHTML = "<a href=\"" + "//0.0.0.0:5000" + "\"><span class=\"fa fa-home\"></span></a>"
    document.getElementsByTagName('footer')[0].innerHTML = "<span class=\"fa fa-copyright\">Samuel Steele</span>"
}

function parseData() {
    return eval('(' + document.getElementsByTagName('data')[0].textContent + ')')
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}