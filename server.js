var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\node server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  //以  http://localhost:8080/sss?wd=hello&rsv=rsv_spt#5   为例
  var parsedUrl = url.parse(request.url, true) 
  var pathName = parsedUrl.pathname  //pathName为路径，即为    /sss
  var queryObject = parsedUrl.query     //queryObject为查询参数对象，即为   { wd: 'hello', rsv: 'rsv_spt' }
  var method = request.method

  if(pathName === '/'){
    var string = fs.readFileSync('./jsonp.html', 'utf8')
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    var amount = fs.readFileSync('./db', 'utf8')
    string = string.replace('&&&amount&&&', amount)
    response.write(string)
  }else if(pathName === '/jsonp.css'){
    var string = fs.readFileSync('./jsonp.css', 'utf8')
    response.setHeader('Content-Type', 'text/css; charset=utf-8')
    response.write(string)
  }else if(pathName === '/jsonp.js'){
    var string = fs.readFileSync('./jsonp.js', 'utf8')
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    response.write(string)
  }else if(pathName === '/pay'){
    var amount = fs.readFileSync('./db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./db', newAmount)
    response.setHeader('Content-Type', 'application/javascript; charset=utf-8')
    response.write(`
      ${queryObject.callback}.call(undefined, {
        'ret': 'success',
        'amount': ${newAmount}
      })
    `)
  } else if(pathName === '/cors'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://js.jirengu.com')
    var string = JSON.stringify()
    response.write(`
    {
      "people":{
        "name": "海山城",
        "age": "25",
        "sex": "male"
      }
    }
    `)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type','text/plain;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://js.jirengu.com')
    response.write('找不到对应路径')
  }
  response.end()
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)