const http = require('http')
const url = require('url')

function start(route, handle) {
  function onRequest(req, res) {
    let postData = ''
    const pathname = url.parse(req.url).pathname
    console.log('request received for:' + pathname);

    route(handle, pathname, res, req)
  }

  http.createServer(onRequest).listen(8888)
  console.log('server has started at: localhost:8888');
}

exports.start = start
