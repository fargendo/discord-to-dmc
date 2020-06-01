const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 9000 })
require('./app.js')

const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

// Set up websocket server
wss.on('connection', function connection(ws, req) {
	console.log('User connected to websocket server from: ')
	ws.on('message', function incoming(data) {
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data)
			}
		})
	})
})
