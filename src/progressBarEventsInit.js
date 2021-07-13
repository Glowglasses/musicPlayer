import $ from 'jquery'
let progressBar = $(".progress-bar")
let controlsBar = $(".controls-bar")
let bgImg = $(".bg-image")
let audioPlayer = $(".audio-player")
let progressBarLen = parseInt(progressBar.css("width").split("px")[0] )
let currentLen = 0
let sourceX
let isMove
let moveLen

controlsBar.on("mousemove", (e) => {
    e.preventDefault()
    // e.preventDefault()
    // if ($(e.target).hasClass("progress-bar") || $(e.target).hasClass("cur")){
    //     progressBar.children(".cur").css("padding-left", e.offsetX + "px")
    // }else if ($(e.target).hasClass("btn")){
    //     currentLen = parseInt($(e.target).parent().css("padding-left").split("px")[0])
    //     sourceX = e.pageX
    //     audioPlayer.off("timeupdate")
    //     controlsBar.on("mousemove",(e) => {
    //         e.preventDefault()
    //         moveLen = e.pageX - sourceX
    //         isMove = moveLen !== 0;
    //         if (moveLen+currentLen <= progressBarLen && moveLen + currentLen >= 0){
    //             progressBar.children(".cur").css("padding-left", moveLen + currentLen + "px")
    //             localStorage.setItem("progressState", "normal")
    //         }else if (moveLen + currentLen > progressBarLen){
    //             localStorage.setItem("progressState", "super")
    //         }else {
    //             localStorage.setItem("progressState", "lesser")
    //         }
    //     })
    // }
})


// controlsBar.on("mouseup", (e) => {
//     e.preventDefault()
//     controlsBar.off("mousemove")
// })
// bgImg.on("mouseup",(e)=>{
//     e.preventDefault()
//     controlsBar.off("mousemove")
// })

