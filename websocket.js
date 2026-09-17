import { WebSocketServer } from "ws";
import express from "express"



const socketRouter = express.Router()

let Users = []





export function loadWebsocket(server) {
    const websocketServer = new WebSocketServer({server})


    websocketServer.on("connection",(ws)=> {
        console.log("socket server active!")

        ws.on("close",()=> {
            const existingUser = Users.find(users => users.socket == ws)

            if (existingUser) {
                const newUserTable = Users.filter(user => user.socket !== ws)
                Users = newUserTable
                console.log("removed",Users)
            }
        })


        ws.on("message",(rawData)=> {
            const Data = JSON.parse(rawData)

            if (Data.type == "addUser") {
                const existingUser = Users.find(users => users.socket == ws)

                if (!existingUser) {
                    Users.push({socket : ws,id : Users.length})
                    console.log("successful!")
                }

            }

            if (Data.type == "callUser") {
                const caller = Users.find(user => user.socket === ws)
                const existingUsers = Users.find(users => users.socket !== ws)
                if (existingUsers) {
                    existingUsers["socket"].send(JSON.stringify({type : "returnOffer",offer : Data.offer,sender : caller["id"]}))
                }
            } 

            if (Data.type == "sendAnswer") {
                const target = Users.find(user => user.id == Data.sender)
                if (target) {
                    target["socket"].send(JSON.stringify({type : "sendAnswer",answer : Data.answer}))
                }
            }

            if (Data.type == "iceCandidate") {
                const caller = Users.find(user => user.socket === ws)
                const existingUsers = Users.find(users => users.socket !== ws)

                if (existingUsers) {
                    existingUsers["socket"].send(JSON.stringify({type : "receiveCandidate",candidate : Data.candidate,sender :caller["id"] }))
                }
            }
        })
    })
}











export default socketRouter