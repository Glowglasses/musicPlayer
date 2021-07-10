import $ from "jquery"
let cover = $(".cover")
let buttonRow = $(".controls-bar")

function controlsInit(audioPlayer){
    cover.remove()
    buttonRow.before(cover)
    if (audioPlayer.attr("src") === ""){
        cover[0].style.webkitAnimationPlayState = "paused";
        return false;
    }else if (localStorage.getItem("isPlay") === "true"){
        cover[0].style.webkitAnimationPlayState = "running";
    }else {
        cover[0].style.webkitAnimationPlayState = "paused";
    }
}


export default controlsInit