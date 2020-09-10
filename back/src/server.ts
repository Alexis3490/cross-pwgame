import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import io, {Socket} from 'socket.io'
import fs from 'fs';


import {display, isNull} from './utils'

interface User {
    name_player?: string
}

// prelude -- loading environment variable
dotenv.config()
if (isNull(process.env.PORT)) {
    throw 'Sorry missing PORT env'
}

const port = parseInt(process.env.PORT)
const app = express()

const server = app.listen(port, '127.0.0.1', () => {
    display(chalk.magenta(`crossPWAGame server is running on 0.0.0.0:${port}`))
})

const socketio = io(server)

const users: Record<string, User> = {}

socketio.on('connection', (socket: Socket) => {
    // CURRENT SOCKET/PLAYER

    display(chalk.cyan(`Connection opened for ( ${socket.id} )`))

    socket.on('disconnect', () => {
        if (users[socket.id]?.name_player) {
            const {name_player} = users[socket.id]
            display(chalk.yellow(`Goodbye ${name_player}`))
        }
        display(chalk.cyan(`Connection closed for ( ${socket.id} )`))
    })

    socket.on('game::sendNickname', payload => {
        const user = JSON.parse(payload)
        const {name_player} = user
        const elements = {
            magicNumber: [
                {
                    beg: "",
                    end: "",
                    player: [
                        {name: user.name_player, points: 2}
                    ]
                }
            ],
        }
        const data = JSON.stringify(elements, null, 3);
        fs.writeFile('./db/game.json', data, function (err) {
            if (err) return console.log(err);
        });
        //console.log(JSON.parse(data));
        display(chalk.yellow(`Here comes a new challenger : ${name_player} ( from ${socket.id} )`))

        users[socket.id] = {name_player}

        socket.emit('game::start', {
            score: 2000,
        })

    })
})
