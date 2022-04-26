window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   let form = document.forms[0];
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    const url = "https://ctd-fe2-todo.herokuapp.com/v1/";
    



    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        
        event.preventDefault();
        let emailValue = email.value;
        let passwordValue = password.value;
        let data = {
            email: emailValue,
            password: passwordValue,

        };

        let settings = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        
        realizarLogin(settings);
        
        form.reset();
        

    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
        

        fetch(url+"users/login/", settings)

            .then(function (response) {
                
                if (response.ok) {
                    return response.json();
                } else {
                    throw "Error en la llamada Ajax";
                
                }

            })
            .then(function (data){
                
                    console.log(data);
                    if (data.jwt) {
                    localStorage.setItem('token', data.jwt);
                    window.location.href = 'mis-tareas.html';
                } else {
                    alert("Usuario o contraseña incorrectos")
                }
            })

            .catch(function (error) {
                console.log(error);
                
            });



        
    };

    


});