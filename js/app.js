const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => { 
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();
    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    
    if(ciudad === '' || pais === ''){
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //Consultar la API
    //Los datos deben ser enviados como la api los espera
    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta){

        //Crear una alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center');
        alerta.innerHTML = `
        <strong class = "font-bold">Error!!!</strong>
        <span class = "block">${mensaje}</span> 
        `
        container.appendChild(alerta);

         //Se elimine luego de 5 segundos
        setTimeout( () => {
            alerta.remove();
        }, 5000);
    }
}

function consultarAPI(ciudad,pais){
    const appId = 'd213f6e316ff251da0b303ab2473da4f';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    Spinner(); //Muestra un spinner de carga
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            limpiarHTML()
            
            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada');
                return;
            }
            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
        .catch(error => console.log(error));
}

function mostrarClima(datos){
    const{name,main: {temp,temp_max,temp_min} } = datos;    

    const actual = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const tempActual = document.createElement('p');
    tempActual.innerHTML = `${actual} &#8451;`;
    tempActual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Máxima: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');  
    
    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Mínima: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center','text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempActual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt (grados-273.15);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
        `
    resultado.appendChild(divSpinner);
}