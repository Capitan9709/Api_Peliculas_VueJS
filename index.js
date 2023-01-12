const { createApp } = Vue;

createApp({
  data() {
    return {
      peliculas: "",
      input: "",
      pagina: 0,
      peticionEnCurso: false,
      detalles: "",
      mostrarDetalles: false,
    }
  },
  methods: {
    // Metodo para mostrar las peliculas
    submit(){
      if(this.peticionEnCurso == false){  
        if(this.pagina == 0){
          this.pagina = 1;
          this.peliculas = "";
          this.mostrarDetalles = false;
          }
          this.peticionEnCurso = true;

          axios
            .get(`https://www.omdbapi.com/?apikey=61f9227e&s=${this.input}&page=${this.pagina}`)
            .then(response => {
              if(response.data.Response == "True"){
                if(this.peliculas === ""){
                  this.peliculas = response.data.Search;
                }else{
                  this.peliculas = this.peliculas.concat(response.data.Search);
                }
                this.peticionEnCurso = false;
              }else{
                console.log("No hay mas resultados");
                this.peticionEnCurso = false;
              }
            })
            .catch(error => {
              console.log(error);
            });

          this.pagina ++;
      }
    },
    // Metodo para volver a llamar al metodo submit cada vez que se haga scroll hasta el final
    eventoScroll(){
      if(window.scrollY + window.innerHeight >= document.body.offsetHeight){
        this.submit();
      }
    },
    // Metodo para sacar mas informacion de cada pelicula
    masInformacion(id){
      console.log("Cargando Datos...");
      axios
        .get(`https://www.omdbapi.com/?apikey=61f9227e&i=${id}`)
        .then(response => {
          this.detalles = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      this.mostrarDetalles = true;
    },
    // Metodo para cerrar la ventana de detalles
    cerrarInformacion(){
      this.mostrarDetalles = false;
    }
  },
  computed: {
    
  },
  watch: {
    // Metodo para resetear la pagina cada vez que se modifique el input
    input(){
      this.pagina = 0;
    }
  },
  mounted (){
    // Metodo para que se revise cada vez que se haga scroll
    window.addEventListener("scroll", this.eventoScroll);
  }
}).mount("#app");
