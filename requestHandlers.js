const qs = require('querystring')
const fs = require('fs')
const formidable = require('formidable')

let image = ''

function start(res) {
  console.log('request handler called: start')

  const body = `<html>
                  <head>
                    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
                  </head>
                  <body>
                    <form action="/upload" method="post" enctype="multipart/form-data">
                      <input type="file" name="upload"/>
                      <input type="submit" value="Submit file" />
                    </form>
                  </body>
                </html>`

  res.writeHead('200', { 'Content-Type': 'text/html' })
  res.write(body)
  res.end()
}

function upload(res, req) {
  console.log('request handler called: upload')

  const form = new formidable.IncomingForm()
  console.log('about to parse');
  form.uploadDir = './tmp'
  form.parse(req, (err, fields, files) => {
    console.log('parsing done');
    image = './tmp/tmp_image_' + new Date().getTime()
    fs.renameSync(files.upload.path, image)
    res.writeHead('200', { 'Content-Type': 'text/html' })
    res.write('old path: ' + files.upload.path + '<br/>')
    res.write('received image:<br/>')
    res.write('<img src="/show"/>')
    res.end()
  })
}

function show(res, req) {
  console.log('request handler called: show')
  fs.readFile(image, 'binary', (err, file) => {
    if (err) {
      res.writeHead('500', { 'Content-Type': 'text/html' })
      res.write(err + '\n')
      res.end()
    } else {
      res.writeHead('200', { 'Content-Type': 'image/png' })
      res.write(file, 'binary')
      res.end()
    }
  })
}

exports.start = start
exports.upload = upload
exports.show = show
