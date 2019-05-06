<template>
  <div id="app">
      <v-toolbar>
        <v-toolbar-title>Prueba Libreria</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>
            <router-link to="/usuarios">Usuarios</router-link>
          </v-btn>
          <v-btn flat>
            <router-link to="/libros">Libros</router-link>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapState(["loading"])
  }
};
</script>
