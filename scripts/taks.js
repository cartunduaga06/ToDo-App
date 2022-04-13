// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
    const url = "https://ctd-todo-api.herokuapp.com/v1"
    const token = localStorage.getItem('token');
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    let btnCerrarSesion = document.getElementById('closeApp');
    let formCrearTarea = document.querySelector('.nueva-tarea');
   obtenerNombreUsuario();
   consultarTareas();
   botonesCambioEstado();


  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {

    localStorage.removeItem('token');
    window.location.href = 'index.html';



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
                listaTareas.innerHTML += `
                <li class="tarea">
                    <p>${tarea.description}</p>
                    <div class="tareas-pendientes">
                        <i class=""></i>
                        <i class=""></i>
                    </div>
                </li>
                `;
            });





  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    
    let botoncheck = document.querySelectorAll('.fa-check-circle');
    let botonTrash = document.querySelectorAll('.fa-trash');
    console.log(botoncheck);
    
    botoncheck.forEach(function (boton) {
        boton.addEventListener('click', function (event) {
            event.preventDefault();
            let idTarea = event.target.parentElement.parentElement.id;
            console.log(idTarea);
            let data = {
                completed: true
            };
            let settings = {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            };
            fetch(url + "/tasks/" + `{${idTarea}}`, settings)
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
        });
    });

  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
   
    

    

  };

});