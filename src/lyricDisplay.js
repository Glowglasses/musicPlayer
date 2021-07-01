import $ from "jquery"
import musicData from "./musicDataGet";
import {nextMusic} from "./changeMusic";
import syncProgressBar from "./progressBar";
let lyricList = $(".lyric-list")
let audioPlayer = $(".audio-player")
let lyricDuration
let lyricArray
let center
let currentLyricIndex
let lyricParameter
let lyric
function parseLyric(lyric) {
    let lines = lyric.split('\n')
    let pattern = /\[\d*:\d*.\d*]/
    let result = []
    let time
    let value
    //去掉不含时间的行
    // 一般是第一行 歌词提供者
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1)
    }
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop()
    lines.forEach((item /*数组元素值*/ , index /*元素索引*/ , array/*数组本身*/ )=> {
       time = item.match(pattern)
        //歌词
       value = item.replace(pattern, '')
        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach((item, index, array) => {
//去掉时间里的中括号得到xx:xx.xx
            let t = item.slice(1, -1).split(':')
//将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
        })
    })
//最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
        return a[0] - b[0]
    })
    return result
}

function getDisplayHeight(){
    return lyricList.css("height").split("px")[0]
}
function lyricScroll(event){
    console.log("xxxxx")
    syncProgressBar(lyricDuration, audioPlayer[0].currentTime)
     if (audioPlayer[0].currentTime >= lyricDuration){
        audioPlayer.off("timeupdate",lyricScroll)
        if (localStorage.getItem("playOrder") === "simple"){
            audioPlayer[0].currentTime = 0
            audioPlayer[0].play()
            displayLyric(event.data[3])
        }else if(localStorage.getItem("playOrder") === "sequence"){
            nextMusic(1).then()
        }
    } else if (audioPlayer[0].currentTime > event.data[2][event.data[0]][0]){
         let currentLyric = $(`.lyric-list > li:nth-child(${event.data[0] + 1})`)
         currentLyric.prevAll().removeClass("lyric-active")
         currentLyric.siblings().removeClass("lyric-active")
         currentLyric.addClass("lyric-active")
         // let top = currentLyric.parent().scrollTop()-(currentLyric.parent().offset().top-currentLyric.offset().top) - event.data[1]
         let top = currentLyric[0].offsetTop - lyricList[0].offsetTop - center
         currentLyric.parent().animate({
            scrollTop: top
        })
        // 判断currentIndex 是否超过lyricArray长度
        if (event.data[0] < event.data[2].length - 1){
            event.data[0]++
        }
    }
}
function displayLyric(lyricString){
    lyric = lyricString
    audioPlayer[0].oncanplay = function () {
        lyricDuration = audioPlayer[0].duration
    }
    if (lyric !== ""){
        lyricArray = parseLyric(lyric)
        lyricList.empty()
        center = getDisplayHeight() / 2
        lyricList.css("padding-top",center + "px")
        for (let i = 0; i < lyricArray.length; i++){
            lyricList.append($(`<li>${lyricArray[i][1]}</li>`))
        }
        currentLyricIndex = 0
        lyricParameter  = [currentLyricIndex,center,lyricArray,lyric]
        audioPlayer.on("timeupdate",lyricParameter, lyricScroll)
    }else {
        lyricList.empty()
    }
    
}

function syncLyric(currentTime){
    audioPlayer.off("timeupdate")
    console.log("yyyyyyyyy")
    if (currentTime >= lyricArray[lyricArray.length - 1][0]){
        lyricParameter  = [lyricArray.length - 1,center,lyricArray,lyric,currentTime]
        audioPlayer.on("timeupdate", lyricParameter,lyricScroll)
        audioPlayer[0].currentTime = currentTime
    }else if(currentTime <= lyricArray[0][0]){
        lyricParameter  = [0,center,lyricArray,lyric,currentTime]
        audioPlayer.on("timeupdate", lyricParameter,lyricScroll)
        audioPlayer[0].currentTime = currentTime
    }else {
        for (let i = 0; i < lyricArray.length; i++){
            if (currentTime >= lyricArray[i][0] && currentTime < lyricArray[i + 1][0]){
                currentLyricIndex = i
                let top = $(`.lyric-list > li:nth-child(${currentLyricIndex})`)[0].offsetTop -  lyricList[0].offsetTop - center
                lyricList.animate({
                    scrollTop: top
                })
                lyricParameter  = [currentLyricIndex,center,lyricArray,lyric,currentTime]
                audioPlayer.on("timeupdate",lyricParameter, lyricScroll)
                audioPlayer[0].currentTime = currentTime
            }
        }
    }
}

export {displayLyric,lyricScroll, syncLyric, lyricDuration}

