import $ from "jquery"
import musicData from "./musicCache";

let audioPlayer = $(".audio-player")
function musicIdRightMove(){
    let musicId = JSON.parse(localStorage.getItem("musicId"))["id"]
    let playingId = localStorage.getItem("playingId")
    let previousId = playingId
    let playingIndex = musicId.indexOf(playingId)
    if (playingIndex === musicId.length - 1){
        playingId = musicId[0]
    }else {
        playingId = musicId[playingIndex + 1]
    }
    localStorage.setItem("playingId",playingId)
    localStorage.setItem("previousId",previousId)
}
function musicIdLeftMove(){
    let musicId = JSON.parse(localStorage.getItem("musicId"))["id"]
    let playingId = localStorage.getItem("playingId")
    let previousId = playingId
    let playingIndex = musicId.indexOf(playingId)
    if (playingIndex === 0){
        playingId = musicId[musicId.length - 1]
    }else {
        playingId = musicId[playingIndex - 1]
    }
    localStorage.setItem("playingId",playingId)
    localStorage.setItem("previousId",previousId)
}
function nextMusic(){
    musicIdRightMove()
    let playingId = localStorage.getItem("playingId")
    musicData(playingId).then((songs) => {
        audioPlayer.attr("src",songs["musicUrl"])
        $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
    })
}

function previousMusic(){
    musicIdLeftMove()
    let playingId = localStorage.getItem("playingId")
    musicData(playingId).then((songs) => {
        audioPlayer.attr("src",songs["musicUrl"])
        $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
    })
}

export {previousMusic, nextMusic}