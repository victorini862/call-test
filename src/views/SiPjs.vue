<template>
    <div>
        User: <input type="text" v-model="userName">
        Password: <input type="text" v-model="userPassword">
        <button @click="register()">REGISTER</button>
        <br>

        User receptor: <input type="text" v-model="userReceptor">
        <div class="boton" @click="callTest()">
            TEST JSSIP
        </div>
        <audio ref="remoteAudio" autoplay></audio>

        <button @click="hangupCall()">COLGAR</button>

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
// var session = null
var incomingCall = null

export default {
    name: 'App',
    data() {
        return {
            userName: "",
            userPassword: "",
            userReceptor: "",
            isCalling: false,
            // incomingCall: null,
            session: null,
            // domain: "test01.cam.zonaapp.es",
            domain: "spectrum01.imira.club",
            
            domain_receiver: "test01.cam.zonaapp.es",
            // domain_receiver: "spectrum01.imira.club",

        }
    },
    mounted() {
        //TODO Comprobar que tiene conectado algun dispositivo?

    },
    methods: {
        register() {
            const transportOptions = {
                server: `ws://${this.domain}:5062`
            };
            userAgent = new UserAgent({
                transportOptions,
                authorizationUsername: this.userName,
                authorizationPassword: this.userPassword,
                uri: UserAgent.makeURI(`sip:${this.userName}@${this.domain}`)
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
                    incomingCall = invite;
                    if (incomingCall instanceof Invitation) {
                      incomingCall.accept();
                    }

                },
                onMessage(message) {
                    console.log(message)
                }
            };

            userAgent.delegate.onConnect = () => {
                // On connecting, register the user agent
                console.log("conectado OK")
                registerer.register()
            };

            userAgent.start()
        },
        async callTest() {
            userAgent.start().then(() => {
                const target = UserAgent.makeURI(`sip:${this.userReceptor}@${this.domain_receiver}`);
                const inviter = new Inviter(userAgent, target, {
                    extraHeaders: [
                        'X-App-Command: barge'
                    ]
                });

                this.session = inviter;
                
                inviter.stateChange.addListener(async (state) => {
                    if (state === "Established") {
                        const remoteAudioStream = inviter.sessionDescriptionHandler.peerConnection.getRemoteStreams()[0];
                        if (remoteAudioStream) {
                            this.$refs.remoteAudio.srcObject = remoteAudioStream;
                        }
                    } else if (state === "Terminated") {
                        console.log("Terminada la llamada");
                    }
                });

                inviter.invite()
                    .catch((e) => {
                        console.log("aaaa", e.toString(), e.toString() == "NotAllowedError: The request is not allowed by the user agent or the platform in the current context.");
                        if (e.toString() == "NotFoundError: The object can not be found here.") {
                            alert("Se necesita tener algun dispositivo conectado al equipo que pueda reproducir sonido.")
                        } else if (e.toString() == "NotAllowedError: The request is not allowed by the user agent or the platform in the current context.") {
                            alert("Se necesitan permisos de microfono para poder realizar la llamada.")
                        } else {
                            alert("Ha ocurrido un error.")
                        }
                    })
            });
        },
        
        hangupCall() {
            // TODO if state == "Establishing"
            console.log(this.session);
            // this.session.bye(); 
        },
        acceptCall() {
            if (this.incomingCall instanceof Invitation) {
                console.log(this.incomingCall)
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
    /* text-align: center; */
    color: #2c3e50;
    margin-top: 60px;
}

.boton {
    background-color: rgb(202, 202, 202);
    width: 10%;
    cursor: pointer;
    margin: 50px;
}
</style>