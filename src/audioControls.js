import $ from "jquery"
import {previousMusic, nextMusic} from "./changeMusic";

let audioPlayer = $(".audio-player")
let cover = $(".cover")
let playStyle = $(".playStyle")
let next = $(".next")
let previous = $(".previous")
let playOrder = $(".playOrder")
let playOrderList = ["sequence-play","random-play","simple-cycle-play"]
let playOrderIndex = 0

// 连续点击相关变量
let timer = null;
let clickCount = 0  // 连续点击次数
playStyle.on("click",function (){
    audioPlayer[0].play()
    // if (isPlaying()){
    //     controls[0].style.webkitAnimationPlayState = "paused";
    //     // audioPlayer[0].pause()
    //     audioPlayer[0].source.stop()
    //     playStyle.addClass("play")
    //     playStyle.removeClass("stop")
    //     localStorage.setItem("isPlay","false")
    // }else {
    //     controls[0].style.webkitAnimationPlayState = "running";
    //     // audioPlayer[0].play()
    //     audioPlayer[0].source.start()
    //     playStyle.addClass("stop")
    //     playStyle.removeClass("play")
    //     localStorage.setItem("isPlay","true")
    // }
    if (this.dataset.playing === 'false') {
        cover[0].style.webkitAnimationPlayState = "running"
        audioPlayer[0].play()
        this.dataset.playing = 'true'
        localStorage.setItem("isPlay","true")
        // if track is playing pause it
    } else if (this.dataset.playing === 'true') {
        cover[0].style.webkitAnimationPlayState = "paused"
        audioPlayer[0].pause()
        this.dataset.playing = 'false'
        localStorage.setItem("isPlay","false")
    }
})

// 当歌曲无法播放时，自动跳到上一首
function previousFn(number){
    previousMusic(number).then((audioPlayer)=>{
        // if (!controlsInit(audioPlayer)){
            previousFn(1)
        // }
    })
}
// 当歌曲无法播放时，自动跳到下一首
function nextFn(number){
    nextMusic(number).then((audioPlayer)=>{
        // if (!controlsInit(audioPlayer)){
            nextFn(1)
        // }
    })
}
previous.on("mousedown", ()=>{
    audioPlayer[0].pause()
    clearTimeout(timer)
    clickCount++
    timer = setTimeout(function() {
        clearTimeout(timer)
        audioPlayer.off("timeupdate")
        previousFn(clickCount)
        clickCount = 0
    }, 250)
    
})
next.on("mousedown", ()=>{
    audioPlayer[0].pause()
    clearTimeout(timer)
    clickCount++
    timer = setTimeout(function() {
        clearTimeout(timer)
        audioPlayer.off("timeupdate")
        nextFn(clickCount)
        clickCount = 0
    }, 250)
})
playOrder.on("click",()=>{
    // 切换播放顺序
    if (playOrderIndex === 2){
        playOrder.removeClass(playOrderList[playOrderIndex])
        playOrderIndex = 0
        playOrder.addClass(playOrderList[playOrderIndex])
    }else {
        playOrder.removeClass(playOrderList[playOrderIndex])
        playOrderIndex++
        playOrder.addClass(playOrderList[playOrderIndex])
    }
    // 逻辑处理
    //0 顺序 1 随机 2 单曲
    if (playOrderIndex === 0){
        localStorage.setItem("playOrder","sequence")
    }else if(playOrderIndex === 1){
        localStorage.setItem("playOrder","random")
    }else {
        localStorage.setItem("playOrder","simple")
    }
})
// document.addEventListener("visibilitychange",function(){
//    if (document.visibilityState === 'hidden' && audioStatus === "playing"){
//        controls[0].style.webkitAnimationPlayState = "paused";
//    }else if (document.visibilityState === 'visible' && audioStatus === "playing"){
//        controls[0].style.webkitAnimationPlayState = "running";
//    }
// });
// function isPlaying(){
//     return !audioPlayer[0].stop()
// }