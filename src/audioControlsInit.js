import $ from "jquery"
let controls = $(".controls")
let buttonRow = $(".button-row")

function controlsInit(audioPlayer){
    controls.remove()
    buttonRow.before(controls)
    if (audioPlayer.attr("src") === ""){
        controls[0].style.webkitAnimationPlayState = "paused";
        return false;
    }else if (localStorage.getItem("isPlay") === "true"){
        audioPlayer[0].play()
        controls[0].style.webkitAnimationPlayState = "running";
    }else {
        controls[0].style.webkitAnimationPlayState = "paused";
    }
    return true;
}

export default (audioPlayer)=>{
    return controlsInit(audioPlayer)
}