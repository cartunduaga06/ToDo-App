window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   
    let formulario = document.forms[0];
    let nombre = document.getElementById('inputNombre');
    let apellido = document.getElementById('inputApellido');
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let password2 = document.getElementById('inputPasswordRepetida');
    const url =  "https://ctd-todo-api.herokuapp.com/v1";

    

    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    formulario.addEventListener('submit', function (event) {
      
        event.preventDefault();


        if (nombre.value == '' || apellido.value == '' || email.value == '' || password.value == ''  ) {
            alert('Todos los campos son obligatorios');
        } else if (password.value != password2.value) {
            alert('Las contraseñas no coinciden');

            
        }else if (nombre.value.length < 3 || apellido.value.length < 3 || email.value.length < 3 || password.value.length < 3) {
            alert('El nombre, apellido, email y contraseña deben tener al menos 3 caracteres');
        } else if(!validateEmail(email.value)){
            alert('El email no es válido');
        } else {
             
            
            let data = {
                firstName: nombre.value,
                lastName: apellido.value,
                email: email.value,
                password: password.value
            }
       

        

        let settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        realizarRegister(settings) 
    }
    function validateEmail(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());

    };

    });


    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */

    
    function realizarRegister(settings) {
        
        fetch(url + '/users', settings)
            .then(function (response) {

                if (response.ok != true) {
                    throw new Error('Error en la llamada Ajax, algo ha ido mal');
                }
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                if (data.jwt) {
                    localStorage.setItem('token', data.jwt);
                    window.location.href = 'mis-tareas.html';
                } else {
                    alert('El email ya está registrado');
                }

            })
            .catch(function (error) {
                console.log(error);
            });



    };


});