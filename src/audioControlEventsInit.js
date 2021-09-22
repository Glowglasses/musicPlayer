import $ from 'jquery'
import {previousMusic, nextMusic} from './changeMusic'
import {draw} from './frequencyInit'

let audioPlayer = $('.audio-player')
let cover = $('.cover')
let progressBarCur = $('.progress-bar-cur')
let musicCurrentTime = $('.music-time ol li:nth-child(1)')
// 连续点击相关变量
let timer = null
let clickCount = 0  // 连续点击次数

let paddingLeft
let oldClientX
let newClientX
let moveClientX
let secondMove
let isMove = false
let intervalID
let start = false
let end = false
localStorage.setItem('isMove', 'false')
// 事件委托
let controlsBar = $('.controls-bar')
controlsBar.on('click', (e) => {
  let $element = $(e.target)
  let $currentElement = $(e.currentTarget)
  e.preventDefault()
  if ($element.hasClass('playStyle') || $element.parent().hasClass('playStyle')) {
    if (audioPlayer.attr('src') === undefined) {
      return false
    } else if ($currentElement.find(".playStyle")[0].dataset.playing === 'false') {
      cover[0].style.webkitAnimationPlayState = 'running'
      audioPlayer[0].play()
      intervalID = setInterval(function () {
        draw()
      }, 16)
      $currentElement.find(".playStyle")[0].dataset.playing = 'true'
      $currentElement.find(".playStyle > use").attr("xlink:href", "#icon-stop")
      localStorage.setItem('isPlay', 'true')
      // if track is playing pause it
    } else if ($currentElement.find(".playStyle")[0].dataset.playing === 'true') {
      // 暂停后，频谱回落
      setTimeout(() => {
        clearInterval(intervalID)
      }, 1)
      intervalID = setInterval(function () {
        draw()
        clearInterval(intervalID)
      }, 3000)
      cover[0].style.webkitAnimationPlayState = 'paused'
      console.log('pause')
      audioPlayer[0].pause()
      $currentElement.find(".playStyle")[0].dataset.playing = 'false'
      $currentElement.find(".playStyle > use").attr("xlink:href", "#icon-play")
      localStorage.setItem('isPlay', 'false')
    }
  } else if ($element.hasClass('play-order-setting') || $element.parent().hasClass('play-order-setting')) {
    // let playOrderList = ['sequence-play', 'random-play', 'simple-cycle-play']
    // 切换播放顺序
    if ($currentElement.find('[data-play-order]')[0].dataset.playOrder === "sequence-play") {
      $currentElement.find('[data-play-order]')[0].dataset.playOrder = 'random-play'
      $currentElement.find('[data-play-order] > use').attr("xlink:href", "#icon-random")
      localStorage.setItem('playOrder', 'random')
    } else if ($currentElement.find('[data-play-order]')[0].dataset.playOrder === "random-play") {
      $currentElement.find('[data-play-order]')[0].dataset.playOrder = 'simple-cycle-play'
      $currentElement.find('[data-play-order] > use').attr("xlink:href", "#icon-simpleCycle")
      localStorage.setItem('playOrder', 'simple')
    } else {
      $currentElement.find('[data-play-order]')[0].dataset.playOrder = 'sequence-play'
      $currentElement.find('[data-play-order] > use').attr("xlink:href", "#icon-sequence")
      localStorage.setItem('playOrder', 'sequence')
    }
  }
})


controlsBar.on('mousedown', (e) => {
  e.preventDefault()
  let $element = $(e.target)
  let $currentElement = $(e.currentTarget)
  if ($element.hasClass('previous') || $element.parent().hasClass('previous')) {
    audioPlayer[0].pause()
    clearTimeout(timer)
    clickCount++
    timer = setTimeout(function () {
      clearTimeout(timer)
      audioPlayer.off('timeupdate')
      previousMusic(clickCount).then()
      clickCount = 0
    }, 250)
  } else if ($element.hasClass('next') || $element.parent().hasClass('next')) {
    audioPlayer[0].pause()
    clearTimeout(timer)
    clickCount++
    timer = setTimeout(function () {
      clearTimeout(timer)
      audioPlayer.off('timeupdate')
      nextMusic(clickCount).then(() => {
      })
      clickCount = 0
    }, 250)
  } else if ($element.hasClass('progress-bar-btn')) {
    if (audioPlayer[0].duration !== 'NaN') {
      secondMove = parseInt($('.progress-bar').css('width').split('px')[0]) / audioPlayer[0].duration
      // 计算进度条移动距离
      oldClientX = e.clientX + e.target.style.width.split('px')[0]
      $(document).on('mousemove', (e) => {
        e.preventDefault()
        newClientX = e.clientX
        paddingLeft = parseInt(progressBarCur.css('padding-left').split('px')[0])
        moveClientX = newClientX - oldClientX
        oldClientX = newClientX
        if (moveClientX !== 0 && (moveClientX + paddingLeft) < parseInt($('.progress-bar').css('width').split('px')[0]) && (moveClientX + paddingLeft) >= 0) {
          progressBarCur.css('padding-left', paddingLeft + moveClientX + 'px')
          musicCurrentTime.text(`${parseInt(((paddingLeft + moveClientX) / secondMove) / 60)}`.padStart(2, '0') + '.' + `${parseInt(((paddingLeft + moveClientX) / secondMove) % 60)}`.padStart(2, '0'))
          isMove = true
          localStorage.setItem('isMove', 'true')
        }else if ((moveClientX + paddingLeft) >= parseInt($('.progress-bar').css('width').split('px')[0])){
          end = true
          musicCurrentTime.text($('.music-time ol li:nth-child(2)').text())
        }else if ((moveClientX + paddingLeft) < 0){
          start = true
          musicCurrentTime.text("00:00")
        }
      })
    }
    
  } else if ($element.hasClass('progress-bar') || $element.hasClass('progress-bar-cur')) {
    if (audioPlayer[0].duration !== 'NaN') {
      secondMove = parseInt($('.progress-bar').css('width').split('px')[0]) / audioPlayer[0].duration
      audioPlayer[0].currentTime = (e.offsetX) / secondMove
      progressBarCur.css('padding-left', e.offsetX + 'px')
    }
  }
})
$(document).on('mouseup', (e) => {
  e.preventDefault()
  if (isMove) {
    if (start){
      audioPlayer[0].currentTime = 0
    }else if(end){
      audioPlayer.currentTime = audioPlayer[0].duration
    }else {
      audioPlayer[0].currentTime = (paddingLeft + moveClientX) / secondMove
    }
    isMove = false
    start = false
    end = false
    localStorage.setItem('isMove', 'false')
  }
  $(document).off('mousemove')
})

// document.addEventListener("visibilitychange",function(){
//    if (document.visibilityState === 'hidden' && audioStatus === "playing"){
//        cover[0].style.webkitAnimationPlayState = "paused";
//    }else if (document.visibilityState === 'visible' && audioStatus === "playing"){
//        cover[0].style.webkitAnimationPlayState = "running";
//    }
// });