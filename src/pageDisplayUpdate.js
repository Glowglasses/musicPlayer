/**
 *歌词显示 图片显示 进度条显示 频谱显示
 * */
import $ from "jquery"
import songInfoInit from "./songInfoInit"
import musicLyricInit from "./musicLyricInit"
import syncLyric from "./syncMusicLyric"
import audioControlsInit from "./audioControlsInit";

let audioPlayer = $(".audio-player")
let bgImg = $(".bg-image")
let cover = $(".cover")
let lyricArray
let center
let currentLyricIndex
// 设置歌曲src
function setAudioSrc(arrayBuffer){
    let blob =  new Blob([arrayBuffer],{type:"audio/wav"})
    let src =  URL.createObjectURL(blob)
    audioPlayer.attr("src", src)
}

// 请求数据时 显示加载图
function displayLoading(){

}

// 显示控制
function displayControls(){
    audioControlsInit(audioPlayer)
}

// 显示图片
function displayImage(songs){
    bgImg.css("background-image", `url(${songs['picUrl']})`)
    cover.css("background-image", `url(${songs['picUrl']})`)
}

// 显示歌曲信息
function disPlayMusicInfo(songs){
    songInfoInit([songs["name"],songs["alia"],songs["singer"]])
}

// 显示歌词
function displayLyric(songs){
    lyricArray = musicLyricInit(songs["lyric"])
}
// 显示频谱
function displayFrequency(songs){

}

// 显示进度条
// function displayProgressBar(songs){
//
// }

// 歌曲时间更新监听

function musicTimeEvent(event){
    //歌词同步时间
    if (lyricArray !== undefined){
        center = $(".lyric-list").css("height").split("px")[0] / 2
        currentLyricIndex = syncLyric(lyricArray,center, currentLyricIndex)
    }
    //进度条同步时间
    
}

function display(songs){
    audioPlayer.off("timeupdate")
    currentLyricIndex = 0
    displayControls()
    setAudioSrc(songs["audioCtx"].arrayBuffer)
    displayImage(songs)
    disPlayMusicInfo(songs)
    displayLyric(songs)
    audioPlayer.on("timeupdate", songs, musicTimeEvent)
    if (localStorage.getItem("isPlay") === "true"){
        audioPlayer[0].play()
    }else {
        audioPlayer[0].pause()
    }
}

export default display