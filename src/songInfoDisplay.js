import $ from "jquery"
let songInfo = $(".song-info")



function displayName(info){
    // songInfo.html(info[0] + "\n" + info[1] + "\n" + info[2])
    let ul = $("<ul></ul>")
    ul.append(`<li>${info[0]}</li>`)
    if (info[1] !== undefined){
        ul.append(`<li>${info[1]}</li>`)
    }
    ul.append(`<li>${info[2]}</li>`)
    songInfo.append(ul)
}



export default (info) =>{
    displayName(info)
}