// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.



if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
    const url = "https://ctd-fe2-todo.herokuapp.com/v1"
    const token = localStorage.getItem('token');
    

    let btnCerrarSesion = document.getElementById('closeApp');
    let formCrearTarea = document.querySelector('.nueva-tarea');
   obtenerNombreUsuario();
   consultarTareas();
   

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
      
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, cerrar sesión!'
        }).then((result) => {
        if (result.value) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    })
      
      


  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
    }


    

  };
  fetch(url + "/users/getMe/", settings)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw "Error en la llamada Ajax";
            }
        })
        .then(function (data) {
            console.log(data);
            let nombreUsuario = document.querySelector('.user-info p');
            nombreUsuario.innerHTML = data.firstName + " " + data.lastName;
        })
        .catch(function (error) {
            console.log(error);
        });
  }





  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
    let settings = {
        method: 'GET',  
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
    }
  };
    fetch(url + "/tasks/", settings)
    
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw "Error en la llamada Ajax";
            }
        })
        .then(function (data) {
            console.log(data);
            renderizarTareas(data)
        }
        )

        .catch(function (error) {
            console.log(error);
        });

  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();
    let tarea = document.getElementById('nuevaTarea').value;
    let data = {
        
        description: tarea,
        completed: false
    };

    let settings = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };

    fetch(url + "/tasks/", settings)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw "Error en la llamada Ajax";
            }
        })
        .then(function (data) {
            console.log(data);
            formCrearTarea.reset();
            consultarTareas();
        })
        .catch(function (error) {
            console.log(error);
        });




  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    let listaTareas = document.querySelector('.tareas-pendientes');
            listaTareas.innerHTML = "";
            listado.forEach(function (tarea) {
                let nuevaTarea = document.createElement('li');
                nuevaTarea.classList.add('tarea');
                nuevaTarea.innerHTML = `
                 
                 <span hidden>${tarea.id}</span >
                 
                <p >${tarea.description}</p>
                <div class="acciones">
                    <button class="far fa-check-circle"></button>
                    <button class="fas fa-trash"></butt>
                </div>
                `;
                if (tarea.completed) {
                    nuevaTarea.classList.add('completa');
                }

                listaTareas.appendChild(nuevaTarea);
            }
            );


            
            let botoncheck = document.querySelectorAll('.far.fa-check-circle');
            let botonTrash = document.querySelectorAll('.fa-trash');
    
            console.log(botoncheck);
            botoncheck.forEach((boton) => boton.addEventListener("click", botonesCambioEstado));
            botonTrash.forEach((boton) => boton.addEventListener("click", botonBorrarTarea));

            let cantidadFinalizada = document.getElementById('cantidad-finalizadas');
            
            cantidadFinalizada.innerText = listado.filter(tarea => tarea.completed == true).length;

        };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(e) {
         // Obtenemos el elemento que disparo el evento
  const elemento = e.target;
    // Obtenemos el padre del elemento que disparo el evento
    const padre = elemento.parentElement.parentElement;
    console.log(padre);
    // Obtenemos el texto del elemento padre
    const texto = padre.querySelector('p').innerText;
    console.log(texto);
    // Obtenemos el id de la tarea
    const id = padre.querySelector('span').innerText;
    console.log("este es el id " + id);
    // Creamos un objeto con la tarea
    const tarea = {
        description: texto,
        completed: !elemento.classList.contains('completa')
            
    };
    // Creamos un objeto con los datos de la petición
    const settings = {
        method: 'PUT',
        body: JSON.stringify(tarea),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };

    console.log(settings);
    // Hacemos la petición
    fetch(url + "/tasks/" + id, settings)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw "Error en la llamada Ajax";
            }
        })
        .then(function (data) {
            console.log(data);
            consultarTareas();
        })
        .catch(function (error) {
            console.log(error);
        });



    };

  

    
  
  

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(event) {
   
    const elemento = event.target;
    
    const padre = elemento.parentElement.parentElement;
    console.log(padre);
    
    const id = padre.querySelector('span').innerText;
    console.log("este es el id " + id);

    const settings = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        
        }
    }
    
    fetch(url + "/tasks/" + id, settings)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw "Error en la llamada Ajax";
            }
        })
        .then(function (data) {
            console.log(data);
            consultarTareas();
        })
        .catch(function (error) {
            console.log(error);
        });


        

  }

});