import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import io, {Socket} from 'socket.io'
import fs from 'fs';

import {display, isNull} from './utils'
import {disconnect} from "cluster";

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

const server = app.listen(port, () => {
    display(chalk.magenta(`crossPWAGame server is running on 0.0.0.0:${port}`))

    fs.writeFile('./db/game.json', "",function (err) {
        if (err) return console.log(err);
    });
})

const socketio = io(server)

const users: Record<string, User> = {}
const date= new Date();
const time_zone=date.toString().split(" ")[5];
let seconds;
if(date.getSeconds() <10)
{
    seconds=`0${date.getSeconds()}`
}
else
{
    seconds=date.getSeconds()
}
const date_now=`${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${seconds}+${time_zone.substr(4, 2)}:${time_zone.substr(6, 2)}`
let score=0;
let status=false

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
        let elements;
        fs.readFile('./db/game.json', function (err, data) {
            if (String(data) == "") {
                elements = {
                    magicNumber: [
                        {
                            beg: "",
                            end: "",
                            player: [
                                {name: "", points: "0"},
                                {name: "", points: "0"}
                            ]
                        }
                    ],
                }
            } else {
                elements = JSON.parse(String(data))
            }

            //Player
            for (let i = 0; i < elements.magicNumber[0].player.length; i++) {
                if (elements.magicNumber[0].player[i].name === "") {
                    elements.magicNumber[0].player[i].name = name_player
                    i = elements.magicNumber[0].player.length
                }
            }

            //start
                if (elements.magicNumber[0].player[0].name !== "" && elements.magicNumber[0].player[1].name !== "") {
                    elements.magicNumber[0].beg = String(date_now)
                }

            if(elements.magicNumber[0].player[0].name !== "" && elements.magicNumber[0].player[1].name !== "")
            {
                status=true;
            }

            const name = JSON.stringify(elements, null, 3);
            fs.writeFile('./db/game.json', name, function (err) {
                if (err) return console.log(err);
            });
        });

        //console.log(JSON.parse(data));
        display(chalk.yellow(`Here comes a new challenger : ${name_player} ( from ${socket.id} )`))

        users[socket.id] = {name_player}

        socket.emit('game::start', {
            status: status,
        })
    })

    socket.on('game::sendPoint', payload => {
        const user = JSON.parse(payload)
        const {score_player, name_player} = user
        let elements;
        if(score === 0)
        {
            score=Math.round(Math.random() * Math.floor(1337))
        }
        console.log(score);
        fs.readFile('./db/game.json', function(err, data) {
            if(String(data) == "")
            {
                elements= {
                    magicNumber: [
                        {
                            beg: "",
                            end: "",
                            player: [
                                {name: "", points: "0"},
                                {name: "", points: "0"}
                            ]
                        }
                    ],
                }
            }
            else
            {
                elements=JSON.parse(String(data))
            }

            for(let i=0; i<elements.magicNumber[0].player.length; i++)
            {
                if(score_player === score) {
                    if (parseInt(elements.magicNumber[0].player[i].points) < 3) {
                        if (elements.magicNumber[0].player[i].points === "0" && elements.magicNumber[0].player[i].name === String(name_player)) {
                            elements.magicNumber[0].player[i].points = "1"
                        } else if (elements.magicNumber[0].player[i].points !== "0" && elements.magicNumber[0].player[i].name === String(name_player)) {
                            elements.magicNumber[0].player[i].points = String(parseInt(elements.magicNumber[0].player[i].points) + 1)
                            i = elements.magicNumber[0].player.length
                        }
                    }
                }
            if(i=== elements.magicNumber[0].player.length)
            {
                Math.round(Math.random() * Math.floor(1337))
            }
            }

            if(elements.magicNumber[0].player[0].points === "3" || elements.magicNumber[0].player[1].points === "3")
            {
                elements.magicNumber[0].end=String(date_now);
            }

            const name = JSON.stringify(elements, null, 3);
            fs.writeFile('./db/game.json', name,function (err) {
                if (err) return console.log(err);
            });
        });

        socket.emit('game::start', {
            score: score,
        })
    })

    socket.on('game::newGames', payload => {
        const user = JSON.parse(payload)
        const {} = user
        let elements;

        fs.readFile('./db/game.json', function(err, data) {
            if(String(data) == "")
            {
                elements= {
                    magicNumber: [
                        {
                            beg: "",
                            end: "",
                            player: [
                                {name: "", points: "0"},
                                {name: "", points: "0"}
                            ]
                        }
                    ],
                }
            }
            else
            {
                elements=JSON.parse(String(data))
            }

            elements.magicNumber[0].player[0].points="0"
            elements.magicNumber[0].player[1].points="0"
            elements.magicNumber[0].beg=String(date_now)
            elements.magicNumber[0].end=""

            const name = JSON.stringify(elements, null, 3);
            fs.writeFile('./db/game.json', name,function (err) {
                if (err) return console.log(err);
            });
        });

        socket.emit('game::start', {
        })
    })
})