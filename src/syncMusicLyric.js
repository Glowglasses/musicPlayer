import $ from "jquery";
let audioPlayer = $(".audio-player")
let lyricList = $(".lyric-list")
function syncLyric(lyricArray, center, currentIndex){
    if (currentIndex < lyricArray.length - 1){
        if (audioPlayer[0].currentTime > lyricArray[currentIndex][0]){
            let currentLyric = $(`.lyric-list > li:nth-child(${currentIndex + 1})`)
            currentLyric.prevAll().removeClass("lyric-active")
            currentLyric.siblings().removeClass("lyric-active")
            let top = currentLyric[0].offsetTop - lyricList[0].offsetTop - center
            currentLyric.parent().animate({
                scrollTop: top
            })
            currentLyric.addClass("lyric-active")
            currentIndex++
        }
    }else if (audioPlayer[0].currentTime === audioPlayer[0].duration){
        currentIndex = 0
    }
    return currentIndex
}

export default syncLyric