import $ from "jquery"
const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
function getMusicUrl(musicId){
    return new Promise((resolve)=>{
        // let baseUrl = "https://api.imjad.cn/cloudmusic/?type=song&id="
        // let baseUrl = `http://music.163.com/api/song/enhance/player/url?id=${musicId}&ids=[${musicId}]&br=3200000`
        let baseUrl = "https://bird.ioliu.cn/netease/song?id="
        $.ajax(baseUrl + musicId).done((data)=>{
            resolve(data.data["mp3"].url)
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
        // let baseUrl = "https://api.imjad.cn/cloudmusic/?type=lyric&id="
        // let baseUrl = `https://music.163.com/api/song/lyric?id=${musicId}&lv=1&kv=1&tv=-1`
        let baseUrl = `http://music.163.com/api/song/media?id=`
        $.ajax(baseUrl + musicId).done((data)=>{
            if (data["lrc"] === undefined){
                resolve("")
            }else {
                resolve(data["lrc"])
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
                // let baseUrl = "https://api.imjad.cn/cloudmusic/?type=detail&id="
                // let baseUrl = `https://music.163.com/api/song/detail/?id=${playingMusicId}&ids=%5B${playingMusicId}%5D`/
                let baseUrl = 'https://bird.ioliu.cn/netease/song?id='
                $.ajax(baseUrl + playingMusicId ).done((data)=>{
                    let songs = {}
                    songs["audioContext"] = audioContext
                    // songs["name"] = data.songs[0].name
                    songs["name"] = data["data"].name
                    songs["singer"] = []
                    // data.songs[0]["ar"].forEach((items) => {
                    //     songs["singer"].push(items["name"])
                    // })
                    data["data"]["ar"].forEach((items) => {
                        songs["singer"].push(items["name"])
                    })
                    // songs["alia"] =  data.songs[0].alia[0]
                    songs["alia"] =  data["data"].alia[0]
                    // songs["picUrl"] = data.songs[0].al.picUrl
                    songs["picUrl"] = data["data"]["al"].picUrl
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