import $ from "jquery";
let audioPlayer = $(".audio-player")
import musicData from "./musicCache";
import {previousMusic,nextMusic} from "./changeMusic"
import lyricDisplay from "./lyricDisplay";
import songInfoDisplay from "./songInfoDisplay";
import controlsInit from "./audioControlsInit";
let musicId = JSON.parse(localStorage.getItem("musicId"))
let controls = $(".controls")
// 提前缓存图片
let imageUrl = ["play.png","stop","previous.png","random_play.png","sequence_play","simple_cycle_play.png"]
let img = new Image()
for (let i = 0 ; i < imageUrl.length; i++){
    img.src = "../assets/images/" + imageUrl[i]
}
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
        }
        audioPlayer.attr("src",songs["musicUrl"])
        $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
        audioPlayer[0].play()
        localStorage.setItem("isPlay","true")
        controls.addClass("cover-animation-init")
        songInfoDisplay([songs["name"],songs["alia"],songs["singer"]])
        lyricDisplay(songs["lyric"])
    })
}