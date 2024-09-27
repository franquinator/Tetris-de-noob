var canvas;
var contexto;

var proximaFichaCanvas;
var proximaFichaContexto;
// DibujarImagenEn(imagen,0,0,32,32);
// DibujarImagenEn(imagen,64,64,32,32);
//tamaño de casillas
var ancho;
var alto;

var anchoProxima;
var altoProxima;

var filas = 16;
var columnas = 8;

var multiplicadorDeResolucion = 64;

var FPS = 120;

var tablero;

var musica;

var imagen = new Image();;

const ColorVacio = '#000000';
const Azul = "#0341AE"
const Rojo = "#FF3213"
const Naranja = "#FF971C"
const Verde = "#72CB3B"
const Amarillo = "#FFD500"
const Blanco = "#FFFFFF"

var fichaActual;
var proximaFicha;


var anchoDeBordeDeCuadrado = 4;

const FormaCuadrado = [[0,0,0,0,0]
               ,[0,0,0,0,0]
               ,[0,0,1,1,0]
               ,[0,0,1,1,0]
               ,[0,0,0,0,0]];
const FormaL = [[0,0,0,0,0]
               ,[0,0,2,0,0]
               ,[0,0,2,0,0]
               ,[0,0,2,2,0]
               ,[0,0,0,0,0]];
const FormaT = [[0,0,0,0,0]
               ,[0,0,0,0,0]
               ,[0,3,3,3,0]
               ,[0,0,3,0,0]
               ,[0,0,0,0,0]];
const FormaRara = [[0,0,0,0,0]
               ,[0,2,0,0,0]
               ,[0,2,2,0,0]
               ,[0,0,2,0,0]
               ,[0,0,0,0,0]];
const FormaRaraInvertida = [[0,0,0,0,0]
               ,[0,0,0,4,0]
               ,[0,0,4,4,0]
               ,[0,0,4,0,0]
               ,[0,0,0,0,0]];
const FormaLInvertida = [[0,0,0,0,0]
               ,[0,0,4,0,0]
               ,[0,0,4,0,0]
               ,[0,4,4,0,0]
               ,[0,0,0,0,0]];
const FormaI = [[0,0,0,0,0]
               ,[0,0,5,0,0]
               ,[0,0,5,0,0]
               ,[0,0,5,0,0]
               ,[0,0,5,0,0]];

// Variables de puntaje
var puntos;
var tiempo;


var aumentoDeVelocidad = 1;


var bolsaDeFichas = [];

function iniciar()
{
    puntos = document.getElementById("puntos");
    tiempo = document.getElementById("tiempo");

    imagen = document.getElementById("BloqueRojo");

    musica = document.getElementById("Musica");

    proximaFichaCanvas = document.getElementById("proximaFichaCanvas");
    proximaFichaContexto = proximaFichaCanvas.getContext("2d");

    altoProxima = proximaFichaCanvas.height / 5;
    anchoProxima = proximaFichaCanvas.width / 5;

    canvas = document.getElementById("canvas");
    contexto = canvas.getContext("2d");
    
    canvas.height = filas * multiplicadorDeResolucion;
    canvas.width = columnas * multiplicadorDeResolucion;

    ancho = canvas.width / columnas;
    alto = canvas.height / filas;

    tablero = crearArray2D(columnas,filas)

    for(x=0;x<columnas;x++){
        for(y=0 ; y<filas;y++)
        {
            tablero[x][y] = 0;
        }
    }
    generarFicha();
    
    setInterval(function(){update()},1000/FPS);
    setInterval(function(){slowUpdate()},1000);


}

function update(){
    musica.play();
    BorrarCanvas();
    DibujarCanvasPrincipal();
    DibujarFichaEnMovimiento();

    if(!perdiste())
    {
        fichaActual.y += 1/60 * aumentoDeVelocidad;

        if(!SePuedeMoverAbajo())
        {
            guardarFichaEnCanvasPrincipal();
            generarFicha();
            borrarFilas();
        }
    }
    else{
        reiniciar();
    }
    

}
function slowUpdate(){
    tiempo.textContent = parseInt(tiempo.textContent) + 1;
}
function ficha(x,y,forma)
{
    //cordenadas
    this.x = x;
    this.y = y;

    this.intyCeil = function(){
        return(Math.ceil(this.y));
    }
    this.intxCeil = function(){
        return(Math.ceil(this.x));
    }
    this.intyFloor = function(){
        return(Math.floor(this.y));
    }
    this.intxFloor = function(){
        return(Math.floor(this.x));
    }
    //forma
    this.forma = forma;

}
function reiniciar(){
    tablero = crearArray2D(columnas,filas)

    for(x=0;x<columnas;x++){
        for(y=0 ; y<filas;y++)
        {
            tablero[x][y] = 0;
        }
    }
    puntos.textContent = 0;
    tiempo.textContent = 0;
    generarFicha();
}
function DibujarImagenEn(imagen, x, y,width,height,contexto){
        contexto.drawImage(imagen, x, y,width,height);
}
function crearArray2D(c,f){
    var obj = new Array(c);
    for(a=0;a<c;a++){
        obj[a] = new Array(f);
    }
    return obj;
}
function rellenarBolsaDeFichas(){
    bolsaDeFichas.push(FormaCuadrado);
    bolsaDeFichas.push(FormaI);
    bolsaDeFichas.push(FormaL);
    bolsaDeFichas.push(FormaLInvertida);
    bolsaDeFichas.push(FormaT);
    bolsaDeFichas.push(FormaRaraInvertida);
    bolsaDeFichas.push(FormaRara);
}
function generarFicha(){
    if(proximaFicha == null)
    {
        proximaFicha = new ficha(columnas/2 - 3,0,sacarFormaDeLaBolsa());
    }
    fichaActual = proximaFicha;
    proximaFicha = new ficha(columnas/2 - 3,0,sacarFormaDeLaBolsa());
    DibujarProximaFicha();
}
function DibujarProximaFicha(){
    proximaFichaCanvas.width = proximaFichaCanvas.width;
    proximaFichaCanvas.height = proximaFichaCanvas.height;
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++){
            PintarSegunNumeroEn(proximaFicha.forma[y][x],x,y
                ,proximaFichaContexto,anchoProxima,altoProxima);
        }
    }
}
function sacarFormaDeLaBolsa(){
    if(bolsaDeFichas.length<1)
    {
        rellenarBolsaDeFichas();
    }
    numeroAleatorio = Math.floor(Math.random() * bolsaDeFichas.length);
    fichaASacar = bolsaDeFichas[numeroAleatorio];
    bolsaDeFichas.splice(numeroAleatorio,1);
    console.log(bolsaDeFichas);
    return(fichaASacar)
}
function perdiste(){
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(fichaActual.forma[y][x] != 0 
                && tablero[fichaActual.intxCeil() + x][fichaActual.intyFloor() + y] != 0)
            {
                return true;
            }
        }
    }
    return false;
}
function borrarFilas(){
    filasOcupadas = numeroDeLaFilaOcupada();
    puntos.textContent = parseInt(puntos.textContent) + 100 * filasOcupadas.length;
    for(i=0; i < filasOcupadas.length;i++)
    {    
        borrarFila(filasOcupadas[i]);
        moverHaciaAbajoDesde(filasOcupadas[i]);
    }

}
function moverHaciaAbajoDesde(filaA){
    for(y = filaA-1;y>0; y--){
        for(x = 0;x < columnas; x++){
            tablero[x][y+1] = tablero[x][y];
            tablero[x][y] = 0;
        }
    }
}
function borrarFila(filaA){
    for(x=0;x<columnas;x++)
    {
        tablero[x][filaA] = 0;
    }
}
function numeroDeLaFilaOcupada()
{
    filasOcupadas = [];
    for(y=0 ; y<filas;y++){
        CantidadDeElementosEnLaFila = 0;
        for(x=0;x<columnas;x++)
        {
            if(tablero[x][y] != 0){
                CantidadDeElementosEnLaFila++;
            }
        }
        if(CantidadDeElementosEnLaFila >= columnas){
            filasOcupadas.push(y);
        }
    }
    return(filasOcupadas);
}
function guardarFichaEnCanvasPrincipal(){
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(fichaActual.forma[y][x]!=0)
            {
                tablero[fichaActual.intxFloor() + x][fichaActual.intyFloor() + y] = fichaActual.forma[y][x];
            }
        }
    }
}
function BorrarCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}
function SePuedeMoverAbajo()
{
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(fichaActual.forma[y][x])
            {
                if(fichaActual.intyFloor() + 1 + y > filas-1)
                {
                    return false;
                }
                if(tablero[fichaActual.intxFloor() + x][fichaActual.intyFloor() + 1 + y] != 0) 
                {
                    return false;
                }
            }
        }
    }
    return true;
}
function SePuedeMoverALaIzquierda()
{
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(fichaActual.forma[y][x] != 0)
            {
                if(fichaActual.intxCeil() - 1 + x < 0)
                {
                    return false;
                }
                if(tablero[fichaActual.intxCeil() + x -1][fichaActual.intyFloor() + y] != 0) 
                {
                    return false;
                }
            }
        }
    }
    return true;
}
function SePuedeMoverALaDerecha()
{
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(fichaActual.forma[y][x] != 0)
            {
                if(fichaActual.intxCeil() + 2 + x > columnas)
                {
                    return false;
                }
                if(tablero[fichaActual.intxCeil() + x + 1][fichaActual.intyFloor() + y] != 0) 
                {
                    return false;
                }
            }
        }
    }
    return true;
}
function DibujarFichaEnMovimiento() {
    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++){
            PintarSegunNumeroEn(fichaActual.forma[y][x],fichaActual.x+x,fichaActual.y + y,contexto,ancho,alto);
        }
    }
}
function DibujarCanvasPrincipal(){
    for(y=0;y<filas;y++){
        for(x=0;x<columnas; x++){
            PintarSegunNumeroEn(tablero[x][y],x,y,contexto,ancho,alto);
        }
    }
}
function PintarSegunNumeroEn(numero,x,y,contexto,ancho,alto){
    switch(numero){
        case 1:
            DibujarImagenEn(imagen,x*ancho,y*alto,ancho,alto,contexto);
            break;
        case 2:
            DibujarImagenEn(imagen,x*ancho,y*alto,ancho,alto,contexto);
            break;
        case 3:
            DibujarImagenEn(imagen,x*ancho,y*alto,ancho,alto,contexto);
            break;
        case 4:
            DibujarImagenEn(imagen,x*ancho,y*alto,ancho,alto,contexto);
            break;
        case 5:
            DibujarImagenEn(imagen,x*ancho,y*alto,ancho,alto,contexto);
            break;
    }
}

function girarMatrizDerecha(matriz) {
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const matrizGirada = [];

    // Crear la matriz girada con las dimensiones intercambiadas
    for (let j = 0; j < columnas; j++) {
        matrizGirada[j] = [];
    }

    // Rellenar la matriz girada
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            matrizGirada[j][filas - i - 1] = matriz[i][j];
        }
    }

    return matrizGirada;
}
function girarMatrizIzquierda(matriz) {
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const matrizGirada = [];

    // Crear la matriz girada con las dimensiones intercambiadas
    for (let j = 0; j < columnas; j++) {
        matrizGirada[j] = [];
    }

    // Rellenar la matriz girada
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            matrizGirada[columnas - j - 1][i] = matriz[i][j];
        }
    }

    return matrizGirada;
}
function puedeGirarALaIzquierda(){
    formaFichaGiradaALaIzquierda = girarMatrizIzquierda(fichaActual.forma);


    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(formaFichaGiradaALaIzquierda[y][x] != 0)
            {
                if(fichaActual.intxFloor() + x > columnas - 1)
                {
                    return false;
                }
                if(fichaActual.intxFloor() + x < 0)
                {
                    return false;
                }
                if(tablero[fichaActual.x + x][fichaActual.intyFloor() + y] != 0) 
                {
                    return false;
                }
            }
        }
    }
    return true;
}
function puedeGirarALaDerecha(){
    formaFichaGiradaALaIzquierda = girarMatrizDerecha(fichaActual.forma);


    for(y=0;y<5;y++){
        for(x=0 ; x<5;x++)
        {
            if(formaFichaGiradaALaIzquierda[y][x] != 0)
            {
                if(fichaActual.intxFloor() + x > columnas - 1)
                {
                    return false;
                }
                if(fichaActual.intxFloor() + x < 0)
                {
                    return false;
                }
                if(tablero[fichaActual.x + x][fichaActual.intyFloor() + y] != 0) 
                {
                    return false;
                }
            }
        }
    }
    return true;
}
document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if(!perdiste())
    {
        if((event.key == "a" ||event.key == "ArrowLeft")&& SePuedeMoverALaIzquierda())
        {
            console.log("left");
            fichaActual.x--;
        }
        else if((event.key == "d" ||event.key == "ArrowRight")&& SePuedeMoverALaDerecha())
        {
            console.log("right");
            fichaActual.x++;
        }
        if((event.key == "e" ||event.key == "ArrowUp") && puedeGirarALaDerecha())
        {
            fichaActual.forma = girarMatrizDerecha(fichaActual.forma);
        }
        else if(event.key == "q" && puedeGirarALaIzquierda())
        {
            fichaActual.forma = girarMatrizIzquierda(fichaActual.forma);
        }
        if(event.key == "s"||event.key == "ArrowDown" )
        {
            aumentoDeVelocidad = 8;
        }
    }
});
document.addEventListener("keyup", (event) => {
    if(!perdiste()){
        if(event.key == "s"||event.key == "ArrowDown")
        {
            aumentoDeVelocidad = 1;
        }
    }

});
