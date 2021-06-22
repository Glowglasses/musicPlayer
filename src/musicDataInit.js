import $ from "jquery";
let audioPlayer = $(".audio-player")
import musicData from "./musicCache";
import lyricDisplay from "./lyricDisplay"
import songInfoDisplay from "./songInfoDisplay";
let musicId = localStorage.getItem("musicId")
let controls = $(".controls")
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
    musicData(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
        audioPlayer.attr("src",songs["musicUrl"])
        $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
        audioPlayer[0].play()
        localStorage.setItem("isPlay","true")
        controls.addClass("cover-animation-init")
        lyricDisplay(songs["lyric"])
        songInfoDisplay([songs["name"],songs["alia"],songs["singer"]])
    })
}