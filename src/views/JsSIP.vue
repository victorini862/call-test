<template>
    <div>
        <h1>JsSIP</h1>
        <br>
        User: <input type="text" v-model="userName">
        Password: <input type="password" v-model="userPassword">
        <button @click="register">REGISTER</button>
        <br>

        User receptor: <input type="text" v-model="userReceptor">
        <div class="boton" @click="callTest">TEST JSSIP</div>
        <audio ref="remoteAudio" autoplay></audio>

        <div v-if="isCalling">
            Llamada entrante!!!
            <button @click="acceptCall">Aceptar</button>
            <button @click="rejectCall">Rechazar</button>
        </div>
        {{ isCalling }} -- {{ getCalling }}
    </div>
</template>

<script>
import JsSIP from 'jssip';

let ua = null;
let call = null;

export default {
    name: 'App',
    data() {
        return {
            userName: '',
            userPassword: '',
            userReceptor: '',
            isCalling: false,
        };
    },
    methods: {
        register() {
            const socket = new JsSIP.WebSocketInterface('ws://your-sip-server.com');
            const configuration = {
                sockets: [socket],
                uri: `sip:${this.userName}@your-sip-server.com`,
                password: this.userPassword,
            };

            ua = new JsSIP.UA(configuration);

            ua.on('registered', () => {
                console.log('Registered');
            });

            ua.on('unregistered', () => {
                console.log('Unregistered');
            });

            ua.on('registrationFailed', (data) => {
                console.error('Registration failed:', data.cause);
            });

            ua.start();
        },
        callTest() {
            const dest = `sip:${this.userReceptor}@your-sip-server.com`;
            const options = {
                mediaConstraints: { audio: true, video: false },
            };

            call = ua.call(dest, options);

            call.on('connecting', () => {
                console.log('Connecting...');
            });

            call.on('progress', () => {
                console.log('Call in progress');
            });

            call.on('failed', (data) => {
                console.error('Call failed:', data.cause);
            });

            call.on('ended', () => {
                console.log('Call ended');
            });

            call.on('accepted', () => {
                console.log('Call accepted');
                this.isCalling = true;
            });
        },
        acceptCall() {
            if (call && call.status() === 'incoming') {
                call.answer();
            }
        },
        rejectCall() {
            if (call) {
                call.terminate();
            }
        },
    },
    computed: {
        getCalling() {
            return this.isCalling;
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

.boton {
    background-color: rgb(202, 202, 202);
    width: 10%;
    cursor: pointer;
    margin:
}
</style>