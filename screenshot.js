console.log()
let img = localStorage.getItem('img') ? JSON.parse(localStorage.getItem('img')) : null
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let width, height

if (img) {
  let imgObj = new Image()
  imgObj.src = img.url
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(imgObj, 0, 0)
}
function setScreenshotUrl(obj) {
  console.log('obj: ', obj)
  localStorage.setItem('img', JSON.stringify(obj))

  let imgObj = new Image()
  imgObj.src = obj.url
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

