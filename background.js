var id = 100
var tabIdT

var Capturer = {
  canvas: document.createElement("canvas"),
  yPos: 0,
  scrollHeight: 0,
  scrollWidth: 0,
  fetchPageSize: function (tabId) {
    var self = this
    chrome.tabs.sendMessage(tabId, {
      act: 'fetchPageSize'
    }, self.onResponseVisibleSize)
  },
  onResponseVisibleSize: function (pageSize) {
    Capturer.scrollWidth = pageSize.scrollWidth
    Capturer.scrollHeight = pageSize.scrollHeight
    Capturer.clientWidth = pageSize.clientWidth
    Capturer.clientHeight = pageSize.clientHeight

    Capturer.canvas.width = pageSize.scrollWidth
    Capturer.canvas.height = pageSize.scrollHeight
    Capturer.startCapture()
  },
  startCapture: function () {
    Capturer.captureVisibleBlock()
    self.postImg()
  },
  captureVisibleBlock: function (w, h) {

    var self = this
    var width = w || self.clientWidth
    var height = h || self.clientHeight

    chrome.tabs.captureVisibleTab(null, function (img) {
      var blockImg = new Image()
      var canvas = self.canvas
      blockImg.onload = function () {

        var ctx = canvas.getContext("2d")
        var y = Capturer.clientHeight - Capturer.scrollHeight % Capturer.clientHeight

        ctx.drawImage(blockImg, 0, 0, width, height)
        Capturer.screenshotUrl = canvas.toDataURL()
        chrome.tabs.sendMessage(Capturer.tabId, {
          act: 'screenshot',
          data: Capturer.screenshotUrl
        }, function () {})
        Capturer.postImg()
      }
      blockImg.src = img
    })
  },
  postImg: function () {
    var canvas = Capturer.canvas
    // chrome.tabs.sendMessage(Capturer.tabId, {
    //   act: 'aa',
    //   data: canvas
    // }, function () {})
    var screenshotUrl = canvas.toDataURL()
    var viewTabUrl = chrome.extension.getURL('screenshot.html')
    chrome.tabs.create({
      url: viewTabUrl
    }, function (tab) {
      var targetId = tab.id
      var addSnapshotImageToTab = function (tabId, changedProps) {
        if (tabId != targetId || changedProps.status != "complete")
          return
        chrome.tabs.onUpdated.removeListener(addSnapshotImageToTab)
        var views = chrome.extension.getViews()

        for (var i = 0; i < views.length; i++) {
          var view = views[i];
          if (view.location.href == viewTabUrl) {
            view.setScreenshotUrl({
              url: screenshotUrl,
              width: Capturer.clientWidth,
              height: Capturer.clientHeight
            })
            // sendImg(screenshotUrl)
            // view.setCanvas(canvas)
            break;
          }
        }
      }
      chrome.tabs.onUpdated.addListener(addSnapshotImageToTab)
    })
  }
}

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
        chrome.tabs.sendMessage(Capturer.tabId, {
          act: 'aa',
          data: request
        }, function () {})
      }
    }
  }
}

function takeScreenshot () {
  var tabId = chrome.tabs.getSelected(function (tab) {
    Capturer.tabWin = window
    Capturer.tabId = tab.id
    Capturer.fetchPageSize(tab.id)
  })

}

chrome.browserAction.onClicked.addListener(function (tab) {
  takeScreenshot()
})
