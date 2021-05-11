const WebSocket = require('ws')
const fetch = require('node-fetch')

const wss = new WebSocket.Server({ port: 9000 })
require('./commandChannel.js')

// const test = () => {
// 	const body = {
// 		username: 'LS Chat Bot',
// 		avatar_url: '',
// 		content: 'test31123',
// 	}
// 	fetch(
// 		'https://discord.com/api/webhooks/841483542302425088/cBMrsvbSgIMUV5JIc2EO6yR9SZtCwXEQarHaNnUGK2ZYCzbbBm-aqATuasRv9wWdxO2O',
// 		{
// 			method: 'post',
// 			body: JSON.stringify(body),
// 			headers: { 'Content-Type': 'application/json' },
// 		}
// 	).catch(err => console.log(err))
// }
// test()

// create websocket
const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

// Set up websocket server
wss.on('connection', function connection(ws, req) {
	console.log('User connected to websocket server from: ')
	ws.on('message', function incoming(data) {
		// send message to receiving clients
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data)
			}
		})
	})
})
