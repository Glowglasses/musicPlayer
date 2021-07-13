import $ from "jquery";
// let audioPlayer = $(".audio-player")
import getMusicData from "./musicDataGet";
import display from "./pageDisplayUpdate";
// let musicId = JSON.parse(localStorage.getItem("musicId"))
// audioPlayer[0].controls = false
localStorage.setItem("listName", "local")
localStorage.setItem("isPlay","false")
let playIngId = localStorage.getItem("playingId")
getMusicData(playIngId).then((songs)=>{
    $(".cover").addClass("cover-animation-init")
    display(songs)
})