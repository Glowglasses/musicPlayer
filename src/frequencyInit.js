import $ from 'jquery'

let AudioContext = window.AudioContext || window.webkitAudioContext
let canvas = $('.frequency-canvas')
let canvasCtx
let audioPlayer
let context
let source
let analyser
let length
let dataArray
// draw相关变量
let cWidth
let cHeight
let meterWidth
let gap
let meterNum
let step
let temArray = []

function frequencyInit(url) {
  audioPlayer = $('.audio-player')
  audioPlayer.attr('src', url)
  if (source === undefined) {
    audioPlayer.on('canplaythrough', function () {
      console.log('ready')
      context = new AudioContext
      source = context.createMediaElementSource(audioPlayer[0])
      analyser = context.createAnalyser()
      source.connect(analyser)
      analyser.connect(context.destination)
      analyser.smoothingTimeConstant = 0.85
      analyser.fftSize = 128
      length = analyser.frequencyBinCount
      //创建数据
      dataArray = new Uint8Array(length)
      audioPlayer.off('canplaythrough')
      drawInit()
    })
  }
}

function drawInit() {
  canvasCtx = canvas[0].getContext('2d')
  cWidth = parseInt(canvas[0].width)
  cHeight = parseInt(canvas[0].height)
  meterWidth = 13
  gap = 5
  meterNum = Math.floor((cWidth / 2) / (meterWidth + gap))
  // 这18是对返回的数组进行切割后的长度
  step = Math.floor((length - 18) / meterNum)
}

function draw() {
  temArray = []
  canvasCtx.beginPath()
  canvasCtx.clearRect(0, 0, canvas[0].width, canvas[0].height)
  analyser.getByteFrequencyData(dataArray)
  if (dataArray.length === length) {
    dataArray = dataArray.slice(5, length - 13)
  }
  canvasCtx.fillStyle = 'rgb(0, 0, 0)'
  for (let i = 0; i < meterNum; i++) {
    canvasCtx.fillStyle = `rgb(255, 182, 193)`
    canvasCtx.fillRect(i * (meterWidth + gap), cHeight - (dataArray[(meterNum - i) * step] / 2), meterWidth, dataArray[(meterNum - i) * step] / 2)
    temArray.push((meterNum - i) * step)
  }
  temArray.reverse()
  for (let i = 0; i < temArray.length; i++) {
    canvasCtx.fillStyle = `rgb(255, 182, 193)`
    canvasCtx.fillRect(i * (meterWidth + gap) + meterNum * (meterWidth + gap), cHeight - (dataArray[temArray[i]] / 2), meterWidth, dataArray[temArray[i]] / 2)
  }
}

export {frequencyInit, draw}