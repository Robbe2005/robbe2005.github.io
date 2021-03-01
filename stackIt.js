/** 
 * dodge ceiling 
 * in deze game bestuur je met een joystick een ledje terwijl je 
   een muur moet ontwijken
 @author Seppe Van de Parre en Robbe De Wit
 @versie 1 (4/2/21)
*/

let matrix = new Matrix(WIDTH, HEIGHT);
let rij = -1
let gat
let kolom = 8
let cy = 4
let ry = 7
let score = 0
let scoreField
let hscoreField
let inGame = false
let isDropping = true
let hScore = 0
let levelUpInterval = 3

function setup() {
    matrix.init()
    frameRate(2)
    scoreField = select('#score') //score naar site 
    hScoreField = select('#hScore') //highscore naar site 
    gatKiezen() //1e keer gat kiezen, anders was er in de 1e rij geen gat
}
//functie kijkt op er op de spatiebalk gedrukt wordt
function keyPressed() {
    if (keyCode === 32) { //als knop 32 (spatiebalk) is ingedrukt
        inGame = true; 
    }
}

function gameStep() {
    joystickMove()
    moveWall()
    showWall(kolom, rij, gat) // muur tekenen
    rijBeneden()
    joystickBeweeg()
}
//deze functie zorgt ervoor dat de joystick naar links gaat ipv te "teleporteren"
function joystickBeweeg() {
    if (isDropping == true) {//als isDropping = true gaan de rijen naar beneden, anders kolommen naar links
        if (ry < HEIGHT - 1) { //zolang ry kleiner is dan 7, gaat cy+1
            ry = ry + 1
            matrix.setLed(ry, cy, true, color('white'))
        }
        if (ry == HEIGHT - 1) { //is nodig, anders verdwijnt de speler
            matrix.setLed(HEIGHT - 1, cy, true, color('white'))
        }
    } else {
        if (cy > 0) { //zolang cy groter is dan 0, gaat cy-1
            cy = cy - 1
            matrix.setLed(ry, cy, true, color('white'))
        }
        if (cy == 0) { //is nodig, anders verdwijnt de speler
            matrix.setLed(ry, 0, true, color('white'))
        }
    }
}

//deze functie maakt een random gat
function gatKiezen() {
    gat = Math.floor(Math.random() * (WIDTH - 1)) //random getal tussen 0 en 7
}

//zorgt ervoor dat de muur naar beneden/naar links gaat
function moveWall() {
    if (inGame == true) { //als er op de spatiebalk is gedrukt
        if (isDropping == true) {//als isDropping = true gaan de rijen naar beneden, anders kolommen naar links
            if (rij == HEIGHT - 1) { //als de rij beneden is gaat hij terug helemaal naar boven
                rij = 0
            } else { //als de rij niet beneden is, altijd stap voor stap naar beneden
                rij++
            }
        } else {
            if (kolom == 0) { //als de rij links is gaat hij terug helemaal naar rechts
                kolom = HEIGHT - 1
            } else {//als de rij niet helemaal links is, altijd stap voor stap naar links
                kolom = kolom - 1
            }
        }
    }
}
// laat hele rij/kolom branden behalve 1 led
function showWall(c, r, gat) {
    if (inGame == true) {
        if (isDropping == true) {//als isDropping = true gaan de rijen naar beneden, anders kolommen naar links
            for (let c = 0; c < WIDTH; c++) {
                if (c != gat) { //alle ledjes die niet gelijk zijn aan het gat gaan branden
                    showLed(r, c)
                }
            }
        } else {
            for (let r = 0; r < HEIGHT; r++) {
                if (r != gat) { //alle ledjes die niet gelijk zijn aan het gat gaan branden
                    showLed(r, c)
                }
            }
        }
    }
}
//zorgt ervoor dat je kan bewegen met behulp van de joystick
function joystickMove() {
    if (inGame == true) { //als je dood bent kan je niet meer met de joystick bewegen
        let x = readJoystickX() //lezen van joystick X
        let y = readJoystickY() //lezen van joystick Y
        if (cy < WIDTH - 1 && x > 900) {
            cy += 1
        }
        if (x < 100 && cy > 0) {
            cy -= 1
        }
        if (ry > 0 && y > 900) {
            ry -= 1
        }
        if (y < 100 && ry < HEIGHT - 1) {
            ry += 1
        }
    }
}
//deze functie zorgt ervoor dat je dood kan gaan
function dood(r, gat) {
    gatKiezen()
    score = 0 //score terug naar 0
    scoreField.html(score) //als je dood bent de score ook veranderen op de site
    inGame = false //je moet opnieuw op spatie drukken om de game starten
    isDropping = true
    rij = -1 //muurtje gaat buiten beeld
    kolom = 8
    cy = 4 //speler terug naar midden
    for (let a = 0; a < HEIGHT; a++) { //for lus zorgt ervoor dat het hele scherm rood wordt
        for (let b = 0; b < WIDTH; b++) {
            matrix.setLed(a, b, true, color('red'))
        }
    }
}
//deze functie zorgt voor de score en highscore
function scoreVerhogen() {
    score++
    scoreField.html(score) //score naar html
    if (score > hScore) { //als de score hoger is dan de highscore ==>highscore + 1
        hScore++
        hScoreField.html(hScore) //hScore naar html
    }
    if (score % levelUpInterval == 0) { // score deelbaar door levelUpInterval (3)
        toggleDirection() // verticaal naar horizontaal of andersom (isDropping wijzigen)
    }
}
//deze functie controleert of de rij beneden is
function rijBeneden() {
    if (isDropping == true) {//als isDropping = true gaan de rijen naar beneden, anders kolommen naar links
        if (rij == HEIGHT - 1) {
            if (cy != gat) { //als de rij beneden is en als de speler niet gelijk is aan het gat
                dood()
            } else { //als de rij beneden is en als de speler gelijk is aan het gat
                scoreVerhogen()
                gatKiezen()
            }
        }
    } else {
        if (kolom == 0) {
            if (ry != gat) { //als de kolom links is en als de cursor niet gelijk is aan het gat
                dood()
            } else { //als de rij beneden is en als de cursor gelijk is aan het gat
                scoreVerhogen()
                gatKiezen()
            }
        }
    }
}

function draw() {
    matrix.clear()
    gameStep()
    matrix.show() // altijd!
}

function showLed(row, col) {
    matrix.setLed(row, col, true, color('blue'))
}

function toggleDirection() {
    isDropping = !isDropping
}