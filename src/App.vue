<template>
  <div>
    <div class="boton" @click="callTest()">
      TEST JSSIP
    </div>
    <audio ref="remoteAudio" autoplay></audio>

     <div v-if="isCalling">
        Llamada entrante!!!
        <button @click="acceptCall()">Aceptar</button>
        <button @click="rejectCall()">Rechazar</button>
      </div>
      {{ getCalling }} -- {{ isCalling }}
      <div v-if="getCalling">aa{{ getCalling }}bb</div>
  </div>
</template>

<script>
import { UserAgent, Inviter, Invitation, Registerer } from "sip.js";


var userAgent = null
var registerer = null

export default {
  name: 'App',
  data() {
    return {
      isCalling: false,
      incomingCall: null
    }
  },
  mounted() {
    //TODO Comprobar que tiene conectado algun dispositivo?
    const transportOptions = {
      server: 'ws://test01.cam.zonaapp.es:5062'
    };
    userAgent = new UserAgent({
      transportOptions,
      authorizationUsername: '1001',
      authorizationPassword: '1001',
      uri: UserAgent.makeURI('sip:1001@test01.cam.zonaapp.es')
    })

    registerer = new Registerer(userAgent, {})

    const that = this
    
    // Agregar un "listener" para las llamadas entrantes
    userAgent.delegate = {
      onInvite(invite) {
        invite.stateChange.addListener((state) => {
          if (state == "Established") {
            const remoteAudioStream = invite.sessionDescriptionHandler.peerConnection.getRemoteStreams()[0];
            if (remoteAudioStream) {
              // Set the remote audio stream as the source for the <audio> element.
              that.$refs.remoteAudio.srcObject = remoteAudioStream;
            }
          }
        });
        console.log("RECIBIENDO...");
        that.isCalling = true;
        that.incomingCall = invite;
        // if (this.incomingCall instanceof Invitation) {
        //   this.incomingCall.accept();
        // }

      }
    };

    userAgent.delegate.onConnect = () => {
      // On connecting, register the user agent
      console.log("conectado OK")  
      registerer.register()
    };

    userAgent.start()
  },
  methods: {
    async callTest() {
      
      
      userAgent.start().then(() => {
        const target = UserAgent.makeURI('sip:1002@test01.cam.zonaapp.es');

        const inviter = new Inviter(userAgent, target);
        inviter.stateChange.addListener((state) => {

          if (state == "Established") {
            const remoteAudioStream = inviter.sessionDescriptionHandler.peerConnection.getRemoteStreams()[0];
            if (remoteAudioStream) {
              // Set the remote audio stream as the source for the <audio> element.
              this.$refs.remoteAudio.srcObject = remoteAudioStream;
            }
          } else if (state === "Terminated") {
            console.log("Terminated");
          }
        });

        inviter.invite()
        .catch((e) => {
          console.log("aaaa",e.toString(), e.toString() == "NotFoundError: The object can not be found here.");
          if (e.toString() == "NotFoundError: The object can not be found here.") {
              alert("Se necesitan permisos de microfono para poder realizar la llamada")
          }
          alert("Se necesitan permisos de microfono para poder realizar la llamada")
          //TODO Volver a preguntar los permisos?
          // navigator.mediaDevices.getUserMedia({ audio: true });

        })
      });
    },
    acceptCall() {
      if (this.incomingCall instanceof Invitation) {
        this.incomingCall.accept();
      }
    },

    rejectCall() {
      if (this.incomingCall instanceof Invitation) {
        this.incomingCall.reject();
      }
    }
  },
  computed: {
    getCalling() {
      return this.isCalling
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.boton {
  background-color: rgb(202, 202, 202);
  width: 10%;
  cursor: pointer;
}
</style>
