console.log('content')
chrome.extension.onMessage.addListener(function (message, sender, resCallback) {
  console.log('11: ', message)
  if (message.act == 'fetchPageSize') {
    console.log('fetchPageSize');
    var pageSize = {
      scrollHeight: document.body.scrollHeight,
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight
    }
    resCallback(pageSize);
  }
  if (message.act == 'scrollPage') {
    window.scrollBy(message.x, message.y);
    var pageSize = {};
    resCallback(pageSize);
  }
  if (message.act == 'screenshot') {
    console.log('aaa: ', message.data)
    sendImg(message.data)
  }
  if (message.act == 'a')  {
    console.log(message)
  }
  if (message.act == 'aa') {
    console.log(message)
  }
})

function sendImg (img) {
  // http://localhost:8099/file/uploadLocal2

  var formData = new FormData()
  formData.append('img', img)
  var request = new XMLHttpRequest()
  var url = 'http://localhost:8099/file/uploadLocal2'
  request.open('POST', url)
  request.send(formData)
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {

      }
    }
  }
}
