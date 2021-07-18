import $ from "jquery";
let lyricList = $(".lyric-list")
let temCurrentIndex
function syncLyric(lyricArray, center, currentIndex){
    if (temCurrentIndex !== currentIndex && currentIndex !== undefined){
        let currentLyric = $(`.lyric-list > li:nth-child(${currentIndex + 1})`)
        currentLyric.prevAll().removeClass("lyric-active")
        currentLyric.siblings().removeClass("lyric-active")
        let top = currentLyric[0].offsetTop - lyricList[0].offsetTop - center
        lyricList.animate({
            scrollTop: top
        })
        temCurrentIndex = currentIndex
        currentLyric.addClass("lyric-active")
    }
}
export default syncLyric