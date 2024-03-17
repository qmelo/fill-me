function preload() {
  character = loadImage("character.png")
}

function setup() {
  minSize = min(windowWidth, windowHeight)

  createCanvas(minSize, minSize)
  pixelDensity(1)

  camera = createCapture({
    video: {
      facingMode: "environment",
    },
    audio: false,
  })

  camera.size(1080, 1080)
  camera.hide()

  background(0)

  image(camera, 0, 0, minSize, minSize)

  let xKernel = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1]
  ]

  let yKernel = [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1]
  ]

  loadPixels()
  
  let n = width * height
  let sobel_array = new Uint32Array(n)

  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      i = x + y * width
      xGradient = 0
      yGradient = 0
      for (let xk = -1; xk <= 1; xk++) {
        for (let yk = -1; yk <= 1; yk++) {
          pixelValue = pixels[4 * ((x + xk) + (y + yk) * width)]
          xGradient += pixelValue * xKernel[yk + 1][xk + 1]
          yGradient += pixelValue * yKernel[yk + 1][xk + 1]
        }
      }
      sobel_array[i] = Math.sqrt(
        Math.pow(xGradient, 2) + Math.pow(yGradient, 2)
      )
    }
  }

  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      i = x + y * width
      pixels[4 * i] = sobel_array[i]
      pixels[4 * i + 1] = sobel_array[i]
      pixels[4 * i + 2] = sobel_array[i]
    }
  }

  updatePixels()

  filter(INVERT)

  image(character, 0, 0, minSize, minSize)
}