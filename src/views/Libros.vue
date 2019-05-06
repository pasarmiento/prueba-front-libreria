<template>
  <div>
    <v-container grid-list-md>
      <div>
        <input
          style="height:34px;width:70%; border:solid 1px; border-radius:10px;padding:0px 10px"
          v-model="nombreBusqueda"
          type="text"
          placeholder="Nombre libro"
        >
        <button
          @click="buscarLibro()"
          class="btn btn-success"
          style="display: true; margin:0px 10px;"
        >Buscar</button>
        <button class="btn btn-primary" @click="agregarLibro()">Agrear Libro</button>
      </div>
      <button v-if="buscar" class="btn btn-success" @click="getLibrosDisponibles()">Mostrar todos</button>
      <h1>Libros Disponibles:</h1>
      <table>
        <tr>
          <th>Nombre</th>
          <th>Detalles</th>
          <th>Reservar</th>
        </tr>
        <tr v-for="libro in libros" :key="libro._id">
          <td v-if="libro.estado===true ">{{libro.nombre}}</td>
          <td v-if="libro.estado===true ">
            <button @click="editarLibro(libro)" class="btn btn-primary">Detalles</button>
          </td>
          <td v-if="libro.estado===true ">
            <button @click="reservarLibro(libro)" class="btn btn-danger">Reservar</button>
          </td>
        </tr>
      </table>

      <h1>Libros Reservados:</h1>
      <table>
        <tr>
          <th>Nombre</th>
          <th>Detalles</th>
          <th>Reservar</th>
        </tr>
        <tr v-for="libro in libros" :key="libro._id">
          <td v-if="libro.estado===false ">{{libro.nombre}}</td>
          <td v-if="libro.estado===false ">
            <button @click="editarLibro(libro)" class="btn btn-primary">Detalles</button>
          </td>
          <td v-if="libro.estado===false ">
            <button @click="finalizarReserva(libro)" class="btn btn-warning">Finalizar Reserva</button>
          </td>
        </tr>
      </table>
    </v-container>

    <v-app id="modalLibro">
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Detalles</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <div v-if="estado===true">
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="nombre" label="Nombre Libro*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="codigo" label="Codigo Libro*" hint="aaaa"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="referencia" label="Referencia Libro*"></v-text-field>
                    </v-flex>
                  </v-layout>
                </div>

                <div v-if="estado===false">
                  <h3>Reserva Actual</h3>
                  <v-layout wrap>
                    <v-flex xs6 sm6 md6>
                      <p>Usuario:</p>
                      <input v-model="usuarioReserva.nombre" placeholder readonly>
                    </v-flex>

                    <v-flex xs6 sm6 md6>
                      <p>Email:</p>
                      <input v-model="usuarioReserva.email" placeholder readonly>
                    </v-flex>
                  </v-layout>
                  <br>
                  <br>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <p>Nombre:</p>
                      <input v-model="nombre" placeholder readonly>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <p>Codigo:</p>
                      <input v-model="codigo" placeholder readonly>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <p>Referencia:</p>
                      <input v-model="referencia" placeholder readonly>
                    </v-flex>

                    <v-flex xs12 sm6 md4>
                      <p>Fecha Fin Reserva:</p>
                      <input v-model="date" placeholder readonly>
                    </v-flex>
                  </v-layout>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Cerrar</v-btn>
              <div v-if="estado===true">
                <v-btn color="blue darken-1" flat @click="putEditarLibro()">Actualizar Libro</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog2" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Reserva el libro</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs4 sm6 md12>
                    <v-select :items="usuarios" v-model="usuarioActual" label="Usuarios*" required></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="date"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date"
                          label="Fecha de reserva"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*Requeridos</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog2 = false">Cerrar</v-btn>
              <v-btn color="blue darken-1" flat @click="putReservarLibro()">Reservar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog3" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Agregar Libro</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="nombre" label="Nombre Libro*" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="codigo" label="Codigo Libro*" hint="aaaa"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="referencia" label="Referencia Libro*"></v-text-field>
                  </v-flex>

                  <div v-if="estado===false">
                    <h3>Reserva Actual</h3>
                    <v-flex xs12 sm12 md12>
                      <p>Usuario:</p>
                      <v-text-field v-model="usuarioReserva.nombre"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <p>Email:</p>
                      <v-text-field v-model="usuarioReserva.email"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <p>ID:</p>
                      <v-text-field v-model="usuarioReserva._id"></v-text-field>
                    </v-flex>
                  </div>
                </v-layout>
              </v-container>
              <small>*Requeridos</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog3 = false">Cerrar</v-btn>
              <v-btn color="blue darken-1" flat @click="postLibro()">Agregar Libro</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog4" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Error</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs4 sm6 md12>
                    <input placeholder readonly>
                    <p>Los campos ingresados no son correctos</p>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog4 = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
export default {
  data() {
    return {
      libros: [],
      usuarios: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      idLibro: false,
      nombre: null,
      codigo: null,
      referencia: null,
      estado: null,
      usuario: null,
      usuarioReserva: null,
      libroActual: null,
      usuarioActual: null,
      nombreBusqueda: null,
      buscar: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false
    };
  },
  methods: {
    async getLibrosDisponibles() {
      try {
        this.buscar = false;
        let datos = await axios.get(
          `https://web-server-node1.herokuapp.com/libro`
        );
        this.libros = datos.data.libros.map(item => {
          item.show = true;
          return item;
        });
      } catch (error) {
      } finally {
      }
    },

    async postLibro() {
      try {
        let libro = {
          nombre: this.nombre,
          codigo: this.codigo,
          referencia: this.referencia,
          usuario: this.usuario
        };
        let datos = await axios.post(
          `https://web-server-node1.herokuapp.com/libro`,
          libro
        );
        this.libros.push(datos.data.libro);
      } catch (error) {
        this.dialog4 = true;
      } finally {
        this.dialog3 = false;
      }
    },
    editarLibro(libro) {
      this.dialog = true;
      this.nombre = libro.nombre;
      this.codigo = libro.codigo;
      this.referencia = libro.referencia;
      this.usuario = libro.usuario;
      this.estado = libro.estado;
      this.usuarioReserva = libro.usuario;
      this.idLibro = libro._id;
      this.date = libro.fechafin;
    },

    agregarLibro() {
      this.dialog3 = true;
      this.nombre = null;
      this.codigo = null;
      this.referencia = null;
      this.usuario = null;
      this.estado = true;
    },
    async reservarLibro(libro) {
      this.dialog2 = true;
      this.libroActual = libro;
      try {
        let datos = await axios.get(
          `https://web-server-node1.herokuapp.com/usuario`
        );
        this.usuarios = datos.data.usuarios.map(item => {
          item.text = "Nombre: " + item.nombre + " Id:" + "" + item.email;
          return item;
        });
      } catch (error) {
      } finally {
      }
    },

    async putReservarLibro() {
      this.dialog2 = false;
      let id = this.libroActual._id;
      let arrayUsuario = this.usuarioActual.split([":"]);
      let idU = null;
      let email = arrayUsuario[2];

      for (var i = 0; i < this.usuarios.length; i++) {
        if (this.usuarios[i].email === email) {
          idU = this.usuarios[i]._id;
        }
      }

      try {
        let libro = {
          estado: false,
          usuario: idU,
          fechafin: this.date
        };
        let datos = await axios.put(
          `https://web-server-node1.herokuapp.com/libro/${id}`,
          libro
        );
        Vue.set(this.libroActual, "estado", false);
        Vue.set(this.libroActual, "usuario", datos.data.libro.usuario);
        Vue.set(this.libroActual, "fechafin", datos.data.libro.fechafin);
      } catch (error) {
      } finally {
      }
    },
    async finalizarReserva(pLibro) {
      let id = pLibro._id;
      try {
        let libro = {
          estado: true,
          fechafin: null
        };
        let datos = await axios.put(
          `https://web-server-node1.herokuapp.com/libro/${id}`,
          libro
        );
        for (var i = 0; i < this.libros.length; i++) {
          if (this.libros[i]._id === datos.data.libro._id) {
            Vue.set(this.libros[i], "estado", true);
          }
        }
      } catch (error) {
      } finally {
      }
    },
    async putEditarLibro() {
      this.dialog = false;
      let id = this.idLibro;

      try {
        let libro = {
          nombre: this.nombre,
          codigo: this.codigo,
          referencia: this.referencia
        };
        let datos = await axios.put(
          `https://web-server-node1.herokuapp.com/libro/${id}`,
          libro
        );
        for (var i = 0; i < this.libros.length; i++) {
          if (this.libros[i]._id === id) {
            Vue.set(this.libros[i], "nombre", datos.data.libro.nombre);
            Vue.set(this.libros[i], "codigo", datos.data.libro.codigo);
            Vue.set(this.libros[i], "referencia", datos.data.libro.referencia);
          }
        }
      } catch (error) {
      } finally {
      }
    },

    async buscarLibro() {
      try {
        this.buscar = true;
        let datos = await axios.get(
          `https://web-server-node1.herokuapp.com/libro`
        );
        this.libros = datos.data.libros.map(item => {
          item.show = true;
          return item;
        });
      } catch (error) {
      } finally {
      }
      for (var i = 0; i < this.libros.length; i++) {
        if (this.libros[i].nombre != this.nombreBusqueda) {
          this.libros.splice(i, 1);
          i--;
        }
      }
    }
  },

  created() {
    this.getLibrosDisponibles(10);
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