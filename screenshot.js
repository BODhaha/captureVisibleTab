console.log()
var img = localStorage.getItem('img') ? JSON.parse(localStorage.getItem('img')) : null
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var width, height
var imgData = null
var JSESSIONID = null

chrome.cookies.get({
  url: 'http://192.168.0.252/',
  name: 'JSESSIONID'
}, function(cookie){
  JSESSIONID = cookie.value
  console.log('cookie.value: ', cookie.value, JSESSIONID);
})

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
  var url = 'http://192.168.0.252/file/uploadLocal2'
  request.open('POST', url)
  request.send(formData)
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        console.log('request: ', request)
        let url = JSON.parse(request.response).url
        console.log('url: ', url, textarea)
        var params = {
          fdName: textarea,
          fdAtt: '<img src="'+ url +'"/>'
        }
        sendMsg(params, 'http://192.168.0.252/admin2/sysToken/feedback')
      }
    }
  }
}

function sendMsg (params, url) {
  console.log(params)
  $.ajax({
    //请求类型，这里为POST
    type: 'POST',
    //你要请求的api的URL
    url: url ,
    //必要的时候需要用JSON.stringify() 将JSON对象转换成字符串
    data: JSON.stringify(params), //data: {key:value},
    //添加额外的请求头
    headers : {
      'Content-Type': 'application/json;charset=UTF-8',
      'JSESSIONID': JSESSIONID,
      'X-Requested-With': 'XMLHttpRequest'
    },
    //请求成功的回调函数
    success: function(data){
       //函数参数 "data" 为请求成功服务端返回的数据
       if (data.code === 0) {
         alert(data.content)
       }
       if (data.code === 1) {
         alert(data.content)
       }
       console.log('成功: ', data)
    },
  });
}
