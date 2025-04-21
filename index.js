import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import {Server} from 'socket.io'
import http from 'http'


const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)

const app = express()

const server = http.createServer(app)

const io = new Server(server)


app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})


io.on('connection' , (socket)=>{
    console.log('a new client connected with socket id' , socket.id)
    socket.on('chat message', (msg) => {
        console.log('chat message' , msg)
        io.emit('send_messages_to_all_users', msg);
    });

    socket.on('typing', ()=>{
        socket.broadcast.emit('show_typing_status')
    })

    socket.on('stopped_typing', ()=>{
        socket.broadcast.emit('show_typing_status')
    })
})




server.listen(3000 ,()=>{
    console.log("Server is running on port 3000")
})
