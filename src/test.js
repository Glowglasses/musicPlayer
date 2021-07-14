import $ from 'jquery'
let audioPlayer = $(".audio-player")
audioPlayer[0].load()
audioPlayer[0].onloadedmetadata = ()=>{
    console.log(audioPlayer[0].getStartTime);
    console.log(audioPlayer[0].duration);
}