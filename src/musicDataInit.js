import $ from "jquery";
let audioPlayer = $(".audio-player")
import musicData from "./musicCache";
import {previousMusic,nextMusic} from "./changeMusic"
import {displayLyric} from "./lyricDisplay";
import songInfoDisplay from "./songInfoDisplay";
import controlsInit from "./audioControlsInit";
let musicId = JSON.parse(localStorage.getItem("musicId"))
let controls = $(".controls")
let playStyle = $(".playStyle")
let playOrder = $(".playOrder")
// 提前缓存图片
playOrder.addClass("simple-cycle-play")
playOrder.addClass("random-play")
playOrder.removeClass("simple-cycle-play")
playOrder.removeClass("random-play")

function getMusicId(){
    return new Promise((resolve) =>  {
        // 更新歌曲的接口
        $.ajax("http://45.139.179.160:16333/musicData.json").done((data)=>{
            localStorage.setItem("musicId",JSON.stringify(data))
            resolve(data["id"][0])
        })
    })
}
if (musicId === null) {
    getMusicId().then((musicId) => {
        localStorage.setItem("playingId", musicId)
        localStorage.setItem("previousId", musicId)
        musicData(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
            audioPlayer.attr("src",songs["musicUrl"])
            $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
            audioPlayer[0].pause()
            localStorage.setItem("isPlay","false")
            songInfoDisplay([songs["name"],songs["alia"],songs["singer"]])
            displayLyric(songs["lyric"])
        })
    })
}else {
    let playingId = localStorage.getItem("playingId")
    if (playingId === "undefined"){
        localStorage.setItem("playingId",musicId["id"][0])
    }
    musicData(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
        // 有数据但是无法播放时，自动下一首
        if (songs["musicUrl"] === undefined){
            nextMusic().then((audioPlayer) => {
                if (!controlsInit(audioPlayer)){
                   nextMusic(1).then()
                }
            })
        }else{
            audioPlayer.attr("src",songs["musicUrl"])
            $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
            audioPlayer[0].play()
            localStorage.setItem("isPlay","true")
            controls.addClass("cover-animation-init")
            playStyle.removeClass("play")
            playStyle.addClass("stop")
            songInfoDisplay([songs["name"],songs["alia"],songs["singer"]])
            displayLyric(songs["lyric"])
        }

    })
}