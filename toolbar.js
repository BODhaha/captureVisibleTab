var toolList = $('#toolbar-list')

window.onload = function () {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext("2d")
  canvas.onmousedown = function (ev) {
    var ev = ev || window.event
    ctx.moveTo(ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop)
    document.onmousemove = function (ev) {
      var ev = ev || window.event
      ctx.lineTo(ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop)
      ctx.stroke()
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}
