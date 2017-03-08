const http = require('http')
const router = require('./router')

http.createServer(router).listen(process.env.PORT, process.env.IP)