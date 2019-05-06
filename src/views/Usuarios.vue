<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs6>
          <h1>Usuarios:</h1>
          <table>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
            <tr v-for="usuario in usuarios" :key="usuario.codigo">
              <td>{{usuario.nombre}}</td>
              <td>{{usuario.email}}</td>
            </tr>
          </table>

          <button class="btn btn-success" @click="agregarUsuario()">Agregar Usuario</button>
        </v-flex>
      </v-layout>
    </v-container>
    <v-app id="modalUsuario">
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Agregar Usuario</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="nombre" label="Nombre Usuario*" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="email" label="Email Usuario*" hint="aaaa"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*Requeridos</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="postUsuarios()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog2" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Error</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs4 sm6 md12>
                    <p>Los campos ingresados no son correctos</p>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog2 = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      hola: "1984",
      usuarios: [],
      dialog: false,
      dialog2: false,
      nombre: null,
      email: null
    };
  },
  methods: {
    async getUsuarios() {
      try {
        let datos = await axios.get(
          `https://web-server-node1.herokuapp.com/usuario`
        );
        this.usuarios = datos.data.usuarios;
      } catch (error) {
      } finally {
      }
    },
    async postUsuarios() {
      try {
        let usuario = {
          nombre: this.nombre,
          email: this.email,
          password: "324334"
        };
        let datos = await axios.post(
          `https://web-server-node1.herokuapp.com/usuario`,
          usuario
        );

        this.usuarios.push(datos.data.usuario);
      } catch (error) {
        this.dialog2 = true;
      } finally {
        this.dialog = false;
      }
    },
    agregarUsuario() {
      this.dialog = true;
    }
  },

  created() {
    this.getUsuarios();
  }
};
</script>


<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>