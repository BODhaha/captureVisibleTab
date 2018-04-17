console.log()
var img = localStorage.getItem('img') ? JSON.parse(localStorage.getItem('img')) : null
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var width, height
var imgData = null

if (img) {
  var imgObj = new Image()
  imgObj.src = img.url
  imgData = img.url
  canvas.width = img.width
  canvas.height = img.height
  imgObj.onload = function () {
    ctx.drawImage(imgObj, 0, 0)
  }
}
function setScreenshotUrl(obj) {
  console.log('obj: ', obj)
  localStorage.setItem('img', JSON.stringify(obj))

  var imgObj = new Image()
  imgObj.src = obj.url
  imgData = obj.url
  ctx.drawImage(imgObj, 0, 0)
  canvas.width = obj.width
  canvas.height = obj.height
  width = obj.width
  height = obj.height
  ctx.drawImage(imgObj, 0, 0)
  imgObj.onload = function () {
    ctx.drawImage(imgObj, 0, 0)
  }
}

var submitBtn = document.getElementById('submit-btn')
submitBtn.onclick = function () {
  var textarea = document.getElementById('textarea').value
  var imgData = canvas.toDataURL('image/png')
  imgData = dataURItoBlob(imgData)
  sendImg(imgData, textarea)
  console.log('clicked', textarea)
}

function dataURItoBlob (dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1])
  } else {
    byteString = unescape(dataURI.split(',')[1])
  }
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {type: mimeString})
}

function sendImg (img, textarea) {
  // http://localhost:8099/file/uploadLocal2

  var formData = new FormData()
  formData.append('img', img)
  var request = new XMLHttpRequest()
  var url = 'http://guangeryi.6655.la:4080/file/uploadLocal2'
  request.open('POST', url)
  request.send(formData)
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        console.log('request: ', request)
        let url = JSON.parse(request.response).url
        console.log('url: ', url, textarea)
        // chrome.tabs.sendMessage(Capturer.tabId, {
        //   act: 'aa',
        //   data: request
        // }, function () {})
      }
    }
  }
}
