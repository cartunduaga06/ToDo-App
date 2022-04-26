//loader
function mostrarSpinner(){

    let body = document.querySelector('body');
    let form = document.querySelector('form');

    let spinner = document.createElement('div');
    spinner.setAttribute('id', 'contenedor-carga');
    


}

function ocultarSpinner(){

    // seleccionamos el body para poder remover el sppiner de la pagina

   let body = document.querySelector('body');

    // seleccionamos el formulario oara pder mostrarlo nuevamente   

    let formulario = document.querySelector('form');

    // seleccionamos el spiner

    let spinner = document.querySelector('#contenedor-carga');

    // removemos 

    body.removeChild(spinner);

    // 


}