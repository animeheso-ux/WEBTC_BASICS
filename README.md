WEBRTC is mainly used for video/audio calls, maybe a little bit of messaging and I decided to learn this because why not yk yk


Anyways, it already has the STUN server configured, not TURN because TURN will come later and im lazy



--> A OFFER SENT TO B (VICE VERSA)
--> B RECEIVES A'S OFFER AND CREATES AN ANSWER --> ANSWER FROM B SENT TO A
--> A CONFIGURES REMOTE DESCRIPTION WITH B'S ANSWER
--> ICE CANDIDATE FROM A IS SENT FROM A TO B (VICE VERSA)
--> B RECEIVES IT AND ADD'S A'S ICE TO THE CANDIDATE LIST (VICE VERSA)
--> VIDEO AND AUDIO CALLS ARE MADE POSSIBLE WITH RTCPEERS ON TRACK EVENT
