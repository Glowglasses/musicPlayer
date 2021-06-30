import $ from "jquery";
let audioPlayer = $(".audio-player")
import musicDataGet from "./musicDataGet";
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
function setAudioSrc(arrayBuffer){
    let blob =  new Blob([arrayBuffer],{type:"audio/wav"})
    let src =  URL.createObjectURL(blob)
    audioPlayer.attr("src", src)
}
if (musicId === null) {
    getMusicId().then((musicId) => {
        localStorage.setItem("playingId", musicId)
        localStorage.setItem("previousId", musicId)
        musicDataGet(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
            setAudioSrc(songs["audioContext"]["source"].buffer)
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
    musicDataGet(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
        if (songs === null){
            nextMusic().then((audioPlayer) => {
                if (!controlsInit(audioPlayer)){
                   nextMusic(1).then()
                }
            })
        }else{
            // getFrequencyData(songs["musicUrl"]).then(({source, analyser, frequency})=>{
            //
            // })
            // audioPlayer.attr("src",songs["musicUrl"])
            setAudioSrc(songs["audioContext"]["arrayBuffer"])
            audioPlayer[0].load()
            $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
            audioPlayer[0].pause()
            localStorage.setItem("isPlay","false")
            controls.addClass("cover-animation-init")
            controls[0].style.webkitAnimationPlayState = "paused";
            playStyle.removeClass("stop")
            playStyle.addClass("play")
            songInfoDisplay([songs["name"],songs["alia"],songs["singer"]])
            displayLyric(songs["lyric"])
            
        }

    })
}