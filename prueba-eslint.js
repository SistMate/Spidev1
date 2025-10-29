// Archivo de prueba para ESLint
function suma(a, b) {
    let resultado = a + b
    let sinUsar = 123; // Variable sin usar (ESLint lo detecta)
    return resultado;
}

console.log('La suma es:', suma(2, 3));
