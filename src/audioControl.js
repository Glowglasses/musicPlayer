import $ from 'jquery'

let audioPlayer = $(".audio-player")
let container = $(".container")
let controls = $(".controls")
let playStyle = $(".playStyle")
let next = $(".next")
let previous = $(".previous")
let playOrder = $(".playOrder")
let audioStatus = "paused"
let playOrderList = ["sequence-play","random-play","simple-cycle-play"]
let playOrderIndex = 0
audioPlayer[0].controls = false

// let clickEventFn =  () =>{
//
// }
playStyle.on("click",(e)=>{
    // 延点时，不然 播放暂停按的太快，无法获取audioStatus的值，就进行判断，会造成按钮不会改变
    // 或者将切换按钮逻辑放在监听 播放器是否暂停上
   // setTimeout(clickEventFn,1)
    if (isPlaying()){
        audioPlayer[0].pause()
    }else {
        controls[0].style.webkitAnimationPlayState = "running";
        audioPlayer[0].play()
        playStyle.removeClass("play")
        playStyle.add("stop")
    }
})


container.on("mouseover",()=>{
    if (isPlaying()){
        playStyle.removeClass("play")
        playStyle.addClass("stop")
    }else{
        playStyle.removeClass("stop")
        playStyle.addClass("play")
    }
    playStyle.removeClass("hidden")
    next.removeClass("hidden")
    previous.removeClass("hidden")
    playOrder.removeClass("hidden")
    
})
container.on("mouseout",()=>{
    playStyle.removeClass("active")
    next.removeClass("active")
    previous.removeClass("active")
    playOrder.removeClass("active")
    playStyle.addClass("hidden")
    next.addClass("hidden")
    previous.addClass("hidden")
    playOrder.addClass("hidden")
})


previous.on("mousedown", ()=>{

})
next.on("mousedown", ()=>{

})
playOrder.on("click",()=>{
    // 切换播放顺序
    if (playOrderIndex === 2){
        playOrder.removeClass(playOrderList[playOrderIndex])
        playOrderIndex = 0
        playOrder.addClass(playOrderList[playOrderIndex])
    }else {
        playOrder.removeClass(playOrderList[playOrderIndex])
        playOrderIndex++
        playOrder.addClass(playOrderList[playOrderIndex])
    }
    // 逻辑处理
    if (playOrderIndex === 0){
    
    }else if(playOrderIndex === 1){
    
    }else {
        audioPlayer[0].loop = true
    }
})

function isPlaying(){
    return audioStatus === "playing"
}

audioPlayer[0].addEventListener("playing",()=>{
    audioStatus = "playing"
})
audioPlayer[0].addEventListener("pause",()=>{
    controls[0].style.webkitAnimationPlayState = "paused";
    playStyle.removeClass("stop")
    playStyle.addClass("play")
    audioStatus = "paused"
})
document.addEventListener("visibilitychange",function(){
   if (document.visibilityState === 'hidden' && audioStatus === "playing"){
       controls[0].style.webkitAnimationPlayState = "paused";
   }else if (document.visibilityState === 'visible' && audioStatus === "playing"){
       controls[0].style.webkitAnimationPlayState = "running";
   }
});