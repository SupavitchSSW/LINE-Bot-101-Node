const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')
const config = require('./config')

const app = express()
const port = process.env.PORT || 4000
const hostname = '127.0.0.1'
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer '+config.accessToken
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Push
app.get('/webhook/:msg', (req, res) => {
	// push block
	let msg = req.params.msg
	// let msg ="OK"
	push(msg,'U2b8faafad90c3608f90b7b7809511d6e')
	res.send(msg)
})

// Reply
app.post('/webhook', (req, res) => {
	console.log(JSON.stringify(req.body))
	if(req.body.events[0].type == 'beacon'){
		push('Beacon naja',req.body.events[0].source.userId)
	}
	else{
		// reply block
		let reply_token = req.body.events[0].replyToken
		let msg = req.body.events[0].message.text
		reply(reply_token,msg)
	}

})

function push(msg,userId) {
	let body = JSON.stringify({
	to: userId,
	messages:[
		{
			type: 'text',
			text:msg
		}
	]
	// push body
  })
  // curl
  curl('push',body)
}

function reply(reply_token, msg) {
	let body = JSON.stringify({
	// reply body
	replyToken:reply_token,
	messages:[
		{
			type: 'text',
			text:msg
		}
	]
  })
  // curl
  curl('reply',body)
}

function curl(method, body) {
	request.post({
		url: 'https://api.line.me/v2/bot/message/' + method,
		headers: HEADERS,
		body: body
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode)
	})
}

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
