import $ from 'jquery'

let progressBar = $(".progress-bar")
let controlBar = $(".controls-bar")
let bgImg = $(".bg-image")
let audioPlayer = $(".audio-player")
let progressBarLen = parseInt(progressBar.css("width").split("px")[0] )
let currentLen = 0
let sourceX
let secondLen

controlBar.on("mousedown", (e) => {
    e.preventDefault()
    if ($(e.target).hasClass("progress-bar") || $(e.target).hasClass("cur")){
        progressBar.children(".cur").css("padding-left", e.offsetX + "px")
    }else if ($(e.target).hasClass("btn")){
        currentLen = parseInt($(e.target).parent().css("padding-left").split("px")[0])
        sourceX = e.pageX
        controlBar.on("mousemove",(e) => {
            e.preventDefault()
            let removeLen = e.pageX - sourceX
            if (removeLen !== 0 && removeLen+currentLen <= parseInt(progressBar.css("width").split("px")[0])){
                progressBar.children(".cur").css("padding-left", removeLen + currentLen + "px")
                if (secondLen !== 0){
                    audioPlayer[0].currentTime = secondLen * (removeLen + currentLen)
                }
            }
        })
    }
})
controlBar.on("mouseup", (e) => {
    e.preventDefault()
   controlBar.off("mousemove")
})
bgImg.on("mouseup",(e)=>{
    e.preventDefault()
    controlBar.off("mousemove")
})


function syncProgressBar(duration,currTime){
    secondLen = progressBarLen / duration
    progressBar.children(".cur").css("padding-left", secondLen * currTime + "px")
}


export default syncProgressBar