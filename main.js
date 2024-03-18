function preload() {
  character = loadImage("character.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1)

  camera = createCapture({
    video: {
      facingMode: "environment",
    },
    audio: false,
  })

  camera.hide()

  glsl = x => x[0]

  SOBEL = createFilterShader(glsl`
  precision highp float;

  varying vec2 vTexCoord;
  uniform sampler2D tex0;

  uniform vec2 texelSize;

  void main() {
    vec4 color = texture2D(tex0, vTexCoord);
    vec3 i00 = texture2D(tex0, vTexCoord + texelSize * vec2(-1, -1)).rgb;
    vec3 i01 = texture2D(tex0, vTexCoord + texelSize * vec2(-1,  0)).rgb;
    vec3 i02 = texture2D(tex0, vTexCoord + texelSize * vec2(-1,  1)).rgb;
    vec3 i10 = texture2D(tex0, vTexCoord + texelSize * vec2( 0, -1)).rgb;
    vec3 i12 = texture2D(tex0, vTexCoord + texelSize * vec2( 0,  1)).rgb;
    vec3 i20 = texture2D(tex0, vTexCoord + texelSize * vec2( 1, -1)).rgb;
    vec3 i21 = texture2D(tex0, vTexCoord + texelSize * vec2( 1,  0)).rgb;
    vec3 i22 = texture2D(tex0, vTexCoord + texelSize * vec2( 1,  1)).rgb;
    vec3 h = -i00 - 2.0 * i10 - i20 + i02 + 2.0 * i12 + i22;
    vec3 v = -i00 - 2.0 * i01 - i02 + i20 + 2.0 * i21 + i22;
    float mag = length(vec2(length(h), length(v)));
    gl_FragColor = vec4(vec3(1.0 - mag), 1.0);
  }
  `)
}

function draw() {
  background(0)

  widthRatio = width / camera.width
  heightRatio = height / camera.height

  if (widthRatio < heightRatio) {
    cameraSize = [camera.width * heightRatio, height]
  } else {
    cameraSize = [width, camera.height * widthRatio]
  }

  imageMode(CENTER)
  image(camera.get(), width / 2, height / 2, cameraSize[0], cameraSize[1])

  filter(SOBEL)

  image(character, width / 2, height / 2, height, height)
}

function touchStarted() {
  screenShot()
}

function mousePressed() {
  screenShot()
}

function screenShot() {
  let canvas = document.getElementsByTagName("canvas")[0]
  let data = canvas.toDataURL("image/png")
  let newTab = window.open()
  newTab.document.write("<img src='" + data + "'>")
}