import $ from "jquery"
let lyricList = $(".lyric-list")
let audioPlayer = $(".audio-player")
let lyricScrollFn
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

function lyricScroll(lyricParameter){
        if (audioPlayer[0].currentTime > lyricParameter[2][lyricParameter[0]][0]){
            let currentLyric = $(`.lyric-list > li:nth-child(${lyricParameter[0] + 1})`)
            currentLyric.prevAll().removeClass("lyric-active")
            currentLyric.addClass("lyric-active")
            let top = currentLyric.parent().scrollTop()-(currentLyric.parent().offset().top-currentLyric.offset().top) - lyricParameter[1]
            currentLyric.parent().animate({
                scrollTop: top
            })
            lyricParameter[0]++
        }
}
function displayLyric(lyric){
    if (lyric !== ""){
        let lyricArray = parseLyric(lyric)
        lyricList.empty()
        let center = getDisplayHeight() / 2
        lyricList.css("padding-top",center + "px")
        for (let i = 0; i < lyricArray.length; i++){
            lyricList.append($(`<li>${lyricArray[i][1]}</li>`))
        }
        
        let currentLyricIndex = 0
        let lyricParameter  = [currentLyricIndex,center,lyricArray]
        lyricScrollFn = () => {
            return lyricScroll(lyricParameter)
        }
        audioPlayer.on("timeupdate", lyricScrollFn)
    }else {
        lyricList.empty()
        let center = getDisplayHeight() / 2
        lyricList.css("padding-top",center + "px")
    }
    
}


export {displayLyric, lyricScrollFn}
