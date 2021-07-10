import $ from "jquery";
let audioPlayer = $(".audio-player")
import getMusicData from "./musicDataGet";
import display from "./pageDisplayUpdate";
let musicId = JSON.parse(localStorage.getItem("musicId"))
let cover = $(".cover")
audioPlayer[0].controls = false
localStorage.setItem("listName", "local")
getMusicData().then((songs)=>{
    console.log(songs)
    display(songs)
})
// if (musicId === null) {
//     getMusicId().then((musicId) => {
//         localStorage.setItem("playingId", musicId)
//         localStorage.setItem("previousId", musicId)
//         musicDataGet(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
//             cover.css('animation','cover 23s linear infinite')
//             display(songs)
//         })
//     })
// }else {
//     let playingId = localStorage.getItem("playingId")
//     if (playingId === "undefined"){
//         localStorage.setItem("playingId",musicId["id"][0])
//     }
//     musicDataGet(JSON.parse(localStorage.getItem("playingId"))).then((songs) => {
//         if (songs["audioContext"] === ""){
//             // 收费的歌曲 进行提示
//             // nextMusic().then((audioPlayer) => {
//             //     if (!controlsInit(audioPlayer)){
//             //        nextMusic(1).then()
//             //     }
//             // })
//         }else{
//
//             // setAudioSrc(songs["audioContext"]["arrayBuffer"])
//             // audioPlayer[0].load()
//             // $(".cover-image-url").css("background-image",`url(${songs.picUrl})`)
//             // audioPlayer[0].pause()
//             // localStorage.setItem("isPlay","false")
//             // controls.addClass("cover-animation-init")
//             // controls[0].style.webkitAnimationPlayState = "paused";
//             // playStyle.removeClass("stop")
//             // playStyle.addClass("play")
//             // songInfoDisplay([songs["name"],songs["alia"],songs["singer"]])
//             // displayLyric(songs["lyric"])
//         }
//         cover.css('animation','cover 23s linear infinite')
//         localStorage.setItem("isPlay","false")
//         display(songs)
//     })
// }