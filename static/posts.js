/*window.onload = function () {
    var data = document.getDataElementByDataId('posts').evalValue
    data.map(makePostDOMElement)
    if (document.getElementById('content').children.length >= parseInt(document.getDataElementByDataId('count').evalValue)) {
        contentLoader.style.animationName = ''
        contentLoader.style.visibility = 'hidden'
    }
   .addEventListener('keyup', searchKeyPressed, false)
}*/

document.getElementById('search-box').onkeyup = function (e) {
    console.log(e)
}