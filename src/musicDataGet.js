import $ from "jquery"
const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
function getMusicUrl(musicId){
    return new Promise((resolve)=>{
        let baseUrl = "https://api.imjad.cn/cloudmusic/?type=song&id="
        $.ajax(baseUrl + musicId ).done((data)=>{
            resolve(data.data[0].url)
        })
    })
}
function getMusicArrayBuffer(musicId){
    return new Promise((resolve => {
        getMusicUrl(musicId).then((musicUrl) =>{
            if (musicUrl === undefined){
                resolve(null)
            }else {
                let request = new XMLHttpRequest()
                //请求资源
                request.open('GET',musicUrl)
                request.responseType = 'arraybuffer'
                console.log("cccccccccc")
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            let audioData = request.response
                            // audioContext.decodeAudioData(audioData).then((buffer) => {
                            //     source.buffer = buffer
                            //     console.log(buffer)
                                resolve({"audioContext":audioContext,"arrayBuffer": audioData})
                            // })
                        } else {
                            resolve(null)
                        }
                    }
                }
                request.send()
            }
        })
    }))
}
function getMusicLyric(musicId){
    return new Promise((resolve)=>{
        let baseUrl = "https://api.imjad.cn/cloudmusic/?type=lyric&id="
        $.ajax(baseUrl + musicId ).done((data)=>{
            if (data["lrc"] === undefined){
                resolve("")
            }else {
                resolve(data["lrc"]["lyric"])
            }
            
        })
    })
}

function getMusicDetail(playingMusicId){
    return new Promise((resolve)=>{
        getMusicArrayBuffer(playingMusicId).then((audioContext) => {
            if (audioContext === null){
               resolve(null)
            }else {
                let baseUrl = "https://api.imjad.cn/cloudmusic/?type=detail&id="
                $.ajax(baseUrl + playingMusicId ).done((data)=>{
                    let songs = {}
                    songs["audioContext"] = audioContext
                    songs["name"] = data.songs[0].name
                    songs["singer"] = []
                    data.songs[0]["ar"].forEach((items) => {
                        songs["singer"].push(items["name"])
                    })
                    songs["alia"] =  data.songs[0].alia[0]
                    songs["picUrl"] = data.songs[0].al.picUrl
                    getMusicLyric(playingMusicId).then((lyric)=>{
                        songs["lyric"] = lyric
                        resolve(songs)
                    })
        
                })
            }

        })
    })
}

export default function getData (playingMusicId){
    return  new Promise((resolve) => {
        getMusicDetail(playingMusicId).then((songs) => {
            resolve(songs)
        })
    })
}