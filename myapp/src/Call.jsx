
import { useEffect, useRef, useState } from 'react'


function CallPage() {
  const websocketWF = useRef(null)
  const RTCPEERWF = useRef(null)
  const dataChannelWF = useRef(null)
  const localOfferWF = useRef(null)
  const [inCall,setInCall] = useState(false)
  const localVideoWF = useRef(null)
  const RemoteVideoWf = useRef(null)
  const localCanditateWF = useRef(null)

  async function CallPeer() {
    setInCall(true)


        const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
       })

       localVideoWF.current.srcObject = stream

       
       stream.getTracks().forEach(track => {
        RTCPEERWF.current.addTrack(track,stream)
       })




    
    const offer = await RTCPEERWF.current.createOffer()
    await RTCPEERWF.current.setLocalDescription(offer)
    console.log(offer)
    localOfferWF.current = offer




        websocketWF.current.send(JSON.stringify({offer : offer,type : "callUser"}))
  }



//Setup for webRTC
  useEffect(()=> {

    const setup = async() => {
         const RTCPEER = new RTCPeerConnection({
          iceServers : [
            {
              urls : "stun:stun4.l.google.com:19302"
            }
          ]
         })

    RTCPEERWF.current = RTCPEER

    const dataChannel = RTCPEER.createDataChannel("channel")
    dataChannelWF.current = dataChannel


    dataChannel.onopen = () => {
        console.log("channel open!")
    }

    
      dataChannel.onmessage = (e) => {
        console.log("message:",e.data)
    }



    RTCPEER.onicecandidate = (e) => {
        console.log("found ice canditate!",JSON.stringify(e.candidate))

         console.log(
            "TYPE:",
            e.candidate.type,
            e.candidate.address,
            e.candidate.port
        )

        websocketWF.current.send(JSON.stringify({type : "iceCandidate",candidate : e.candidate}))
    }

    RTCPEER.ontrack = (e) => {
      RemoteVideoWf.current.srcObject = e.streams[0]
     }




    if (websocketWF.current?.readyState == WebSocket.OPEN) {
            websocketWF.current.send(JSON.stringify({type : "addUser"}))
    }


    }


    setup()
   


  },[])

 //Websocket Setup for Client
  useEffect(()=> {
    const websocket = new WebSocket("ws://localhost:3000")
    websocketWF.current = websocket

    websocket.addEventListener("open",()=>{
      console.log("websocket client online!")


        websocket.send(JSON.stringify({type : "addUser"}))
      
    })

    websocket.addEventListener("message",async(rawData)=> {
      const Data = JSON.parse(rawData.data)

      if (Data.type == "returnOffer") {
        await RTCPEERWF.current.setRemoteDescription(Data.offer)
        const answer = await RTCPEERWF.current.createAnswer()
        await RTCPEERWF.current.setLocalDescription(answer)

        websocket.send(JSON.stringify({type : "sendAnswer",answer : answer,sender : Data.sender}))
      }

      if (Data.type == "sendAnswer") {
            await RTCPEERWF.current.setRemoteDescription(Data.answer)






      }

      if (Data.type == "receiveCandidate") {
        console.log("received")

        await RTCPEERWF.current.addIceCandidate(Data.candidate)
      }

    })

  },[])
  


    return (
        <div>
            {inCall === false ? (<button onClick={CallPeer}>Call Someone</button>): (
                <div>
                    <h1>Video</h1>
                    <video ref={localVideoWF}  autoPlay muted></video>
                    <video ref={RemoteVideoWf} autoPlay></video>
                </div>
            )}
        </div>
    )
}


export default CallPage