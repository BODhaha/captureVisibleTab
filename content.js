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
  } else if (message.act = 'scrollPage') {
    window.scrollBy(message.x, message.y);
    var pageSize = {};
    resCallback(pageSize);
  } else if (message.act == 'screenshot') {
    console.log(message.data)
  } else if (message.act == 'a')  {
    console.log(message)
  } else if (message.act == 'aa') {
    console.log(message)
  }
})
