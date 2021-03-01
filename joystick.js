let matrix = new Matrix(WIDTH, HEIGHT);
let r = 7
let c = 2

function setup() {
    matrix.init()
    frameRate(2)
}

function draw() {
  matrix.clear()
  let x = readJoystickX()
  if (c < WIDTH-1 && x > 900) {
    c +=1
  }
  if (x < 100 && c >0) {
    c -= 1
  }
    showLed(r, c)
    matrix.show()

}

function showLed(row, col) {
    matrix.setLed(row, col, true, color('yellow'))
}