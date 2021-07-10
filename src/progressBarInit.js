import $ from 'jquery'
import {syncLyric} from "./musciLyricInit";
import { lyricDuration} from "./musciLyricInit";
let progressBarInit = $(".progress-bar")
let controlBar = $(".controls-bar")
let bgImg = $(".bg-image")
let audioPlayer = $(".audio-player")
let progressBarLen = parseInt(progressBarInit.css("width").split("px")[0] )
let currentLen = 0
let sourceX
let secondLen
let isMove
let moveLen

controlBar.on("mousedown", (e) => {
    e.preventDefault()
    if ($(e.target).hasClass("progress-bar") || $(e.target).hasClass("cur")){
        progressBarInit.children(".cur").css("padding-left", e.offsetX + "px")
        isMove = true
        moveLyric((lyricDuration * (e.offsetX)) / progressBarLen)
        isMove = false
    }else if ($(e.target).hasClass("btn")){
        currentLen = parseInt($(e.target).parent().css("padding-left").split("px")[0])
        sourceX = e.pageX
        audioPlayer.off("timeupdate")
        controlBar.on("mousemove",(e) => {
            e.preventDefault()
            moveLen = e.pageX - sourceX
            isMove = moveLen !== 0;
            if (moveLen+currentLen <= progressBarLen && moveLen + currentLen >= 0){
                progressBarInit.children(".cur").css("padding-left", moveLen + currentLen + "px")
                localStorage.setItem("progressState", "normal")
            }else if (moveLen + currentLen > progressBarLen){
                localStorage.setItem("progressState", "super")
            }else {
                localStorage.setItem("progressState", "lesser")
            }
        })
    }
})
function moveLyric(currentTime){
    if (currentTime < 0){
        currentTime = 0
    }else if (currentTime > audioPlayer[0].duration){
        currentTime = audioPlayer[0].duration
    }
    if (isMove){
        syncLyric(currentTime)
    }
}
controlBar.on("mouseup", (e) => {
    e.preventDefault()
    controlBar.off("mousemove")
    moveLyric((lyricDuration * (moveLen + currentLen)) / progressBarLen)
    isMove = false
})
bgImg.on("mouseup",(e)=>{
    e.preventDefault()
    controlBar.off("mousemove")
    moveLyric((lyricDuration * (moveLen + currentLen)) / progressBarLen)
    isMove = false
})


function syncProgressBar(duration,currTime){
    secondLen =  progressBarLen / duration
    progressBarInit.children(".cur").css("padding-left", secondLen * currTime + "px")

}


export default syncProgressBar