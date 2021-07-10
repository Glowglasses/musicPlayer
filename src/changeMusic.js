import $ from "jquery"
import musicData from "./musicDataGet";
import songInfoDisplay from "./songInfoInit";
import {displayLyric} from "./musciLyricInit";
import display from "./pageDisplayUpdate";
let audioPlayer = $(".audio-player")
function setAudioSrc(arrayBuffer){
    let blob =  new Blob([arrayBuffer],{type:"audio/wav"})
    let src =  URL.createObjectURL(blob)
    audioPlayer.attr("src", src)
}
function musicIdRightMove(count){
    let musicId = JSON.parse(localStorage.getItem("musicId"))["id"]
    let playingId = localStorage.getItem("playingId")
    let playingIndex = musicId.indexOf(playingId)
    if (playingIndex === musicId.length - 1){
        playingId = musicId[0]
    }else {
        playingId = musicId[playingIndex + count]
    }
    let previousId = musicId[musicId.indexOf(playingId) - 1]
    localStorage.setItem("playingId",playingId)
    localStorage.setItem("previousId",previousId)
}
function musicIdLeftMove(count){
    let musicId = JSON.parse(localStorage.getItem("musicId"))["id"]
    let playingId = localStorage.getItem("playingId")
    let playingIndex = musicId.indexOf(playingId)
    if (playingIndex === 0){
        playingId = musicId[musicId.length - count]
    }else {
        playingId = musicId[playingIndex - count]
    }
    let previousId = musicId[musicId.indexOf(playingId) + 1]
    localStorage.setItem("playingId",playingId)
    localStorage.setItem("previousId",previousId)
}
function changeAudioInfo(resolve){
    let playingId = localStorage.getItem("playingId")
    musicData(playingId).then((songs) => {
        // if (songs === null){
        //     audioPlayer.attr("src","")
        //     resolve(audioPlayer)
        // }else{
        display(songs)
        resolve(audioPlayer)
        // }
        
    })
}
function nextMusic(count){
    return new Promise((resolve)=>{
        musicIdRightMove(count)
        changeAudioInfo(resolve)
    })
    
}

function previousMusic(count){
    return new Promise((resolve)=>{
        musicIdLeftMove(count)
        changeAudioInfo(resolve)
    })
    
}

export {previousMusic, nextMusic}