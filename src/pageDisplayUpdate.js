/**
 *歌词显示 图片显示 进度条显示 频谱显示
 * */
import $ from "jquery"
import songInfoInit from "./songInfoInit"
import musicLyricInit from "./musicLyricInit"
import syncLyric from "./syncMusicLyric"
import {nextMusic} from "./changeMusic";

let audioPlayer = $(".audio-player")
let bgImg = $(".bg-image")
let cover = $(".cover")
let controlsBar = $(".controls-bar")
let playOrderSetting = $(".play-order-setting")
let musicDuration = $(".music-time ol li:nth-child(2)")
let musicCurrentTime = $(".music-time ol li:nth-child(1)")
let song
let lyricArray
let center
let currentLyricIndex
let currentTime
// 设置歌曲src
function setAudioSrc(arrayBuffer){
    let blob =  new Blob([arrayBuffer],{type:"audio/mpeg"})
    console.log(blob)
    let src =  URL.createObjectURL(blob)
    audioPlayer.attr("src", src)
}

// 请求数据时 显示加载图
function displayLoading(){

}

// 显示控制
function displayControls(){
    cover.remove()
    controlsBar.before(cover)
    if (audioPlayer.attr("src") === ""){
        cover[0].style.webkitAnimationPlayState = "paused";
        return false;
    }else if (localStorage.getItem("isPlay") === "true"){
        cover[0].style.webkitAnimationPlayState = "running";
    }else {
        cover[0].style.webkitAnimationPlayState = "paused";
    }
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

// 显示歌曲时间
function displayMusicDuration(){
    audioPlayer[0].load()
    audioPlayer[0].oncanplay = ()=>{
    musicDuration.text(`${parseInt(audioPlayer[0].duration / 60)}`.padStart(2, '0') + '.' + `${parseInt(audioPlayer[0].duration % 60)}`.padStart(2, '0'))
    }
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
    //显示当前播放时间
    musicCurrentTime.text(`${parseInt(audioPlayer[0].currentTime / 60)}`.padStart(2, '0') + '.' + `${parseInt(audioPlayer[0].currentTime % 60)}`.padStart(2, '0'))
    //歌词同步时间
    if (lyricArray !== undefined){
        center = $(".lyric-list").css("height").split("px")[0] / 2
        currentLyricIndex = syncLyric(lyricArray,center, currentLyricIndex)
    }
    //进度条同步时间
    // 播放结束处理
    if (audioPlayer[0].currentTime >= audioPlayer[0].duration){
        // console.log("总时间",audioPlayer[0].duration, "当前时间", audioPlayer[0].currentTime)
        if (playOrderSetting[0].dataset.playOrder === "sequence-play"){
            nextMusic(1).then()
        }else if (playOrderSetting[0].dataset.playOrder === "random-play"){
        
        }else if (playOrderSetting[0].dataset.playOrder === "simple-cycle-play"){
            display(song)
        }
    }
}

function display(songs){
    song = songs
    audioPlayer.off("timeupdate")
    currentLyricIndex = 0
    displayControls()
    setAudioSrc(songs["audioCtx"].arrayBuffer)
    displayImage(songs)
    disPlayMusicInfo(songs)
    displayLyric(songs)
    displayMusicDuration()
    audioPlayer.on("timeupdate", songs, musicTimeEvent)
    if (localStorage.getItem("isPlay") === "true"){
        audioPlayer[0].play()
    }else {
        audioPlayer[0].pause()
    }
}

export default display