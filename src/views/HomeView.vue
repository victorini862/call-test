<template>
    <div>
        <button @click="goToJSSiP()">
            Go To JSSiP
        </button>

        <button @click="goToSIPjs()">
            Go To SIPjs - ESETE ES EL QUE SE USA EN SPECTRUM
        </button>
    </div>
</template>

<script>

export default {
    methods: {
        goToJSSiP() {
            this.$router.push({ path: "/jssip" })
        },
        goToSIPjs() {
            this.$router.push({ path: "/sipjs" })
        },
    },
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