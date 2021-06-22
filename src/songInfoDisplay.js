import $ from "jquery"
let songInfo = $(".song-info")
let lyricList = $(".lyric-list")
let lyricDisplay = $(".lyric-display")


function displayName(info){
    // songInfo.html(info[0] + "\n" + info[1] + "\n" + info[2])
    songInfo.empty()
    let ul = $("<ul></ul>")
    ul.append(`<li>${info[0]}</li>`)
    if (info[1] !== undefined){
        ul.append(`<li>${info[1]}</li>`)
    }
    ul.append(`<li>${info[2]}</li>`)
    songInfo.append(ul)
    lyricList.css("height", lyricDisplay.css("height").split("px")[0] -  songInfo.css("height").split("px")[0])
}



export default (info) =>{
    displayName(info)
}