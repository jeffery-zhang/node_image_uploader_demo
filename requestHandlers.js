const qs = require('querystring')
const fs = require('fs')
const formidable = require('formidable')

let image = ''
let type = ''
let suffix = ''

function start(res) {
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
  const form = new formidable.IncomingForm()
  form.uploadDir = './tmp'
  form.parse(req, (err, fields, files) => {
    console.log(files.upload);
    const arr = files.upload.name.split('.')
    type = files.upload.type
    suffix = arr[arr.length - 1]
    image = './tmp/tmp_image_' + new Date().getTime() + '.'+ suffix
    fs.renameSync(files.upload.path, image)
    res.writeHead('200', { 'Content-Type': 'text/html' })
    res.write('<img src="/show"/>')
    res.end()
  })
}

function show(res, req) {
  fs.readFile(image, 'binary', (err, file) => {
    if (err) {
      res.writeHead('500', { 'Content-Type': 'text/html' })
      res.write(err + '\n')
      res.end()
    } else {
      res.writeHead('200', { 'Content-Type': type })
      res.write(file, 'binary')
      res.end()
    }
  })
}

exports.start = start
exports.upload = upload
exports.show = show
