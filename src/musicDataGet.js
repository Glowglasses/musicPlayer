import $ from "jquery"
const AudioContext = window.AudioContext || window.webkitAudioContext

const audioContext = new AudioContext()
let songs = {}
let musicUrlAPI = "/assets/musicInfo/url/"
let musicLyricAPI= "/assets/musicInfo/lyric/"
let musicDetailAPI = "/assets/musicInfo/detail/"
let musicIdAPI = "/assets/musicInfo/musicId.json"

// let musicUrlAPI = "https://api.imjad.cn/cloudmusic/?type=song&id="
// let musicUrlAPI = "https://v1.hitokoto.cn/nm/url/"
// let musicLyricAPI = "https://api.imjad.cn/cloudmusic/?type=lyric&id="
// let musicLyricAPI = "https://v1.hitokoto.cn/nm/lyric/"
// let musicDetailAPI = "https://api.imjad.cn/cloudmusic/?type=detail&id="
// let musicDetailAPI = "https://v1.hitokoto.cn/nm/detail/"
// null 请求失败  ”“ 请求成功但是没数据
// let musicIdUrl = "http://45.139.179.160:16333/musicData.json"
//
function getMusicId(){
    return new Promise((resolve) =>  {
        // 更新歌曲的接口
        $.ajax(musicIdAPI).done((data)=>{
            localStorage.setItem("musicId",JSON.stringify(data))
            resolve(data["id"][0])
        })
    })
}

function getMusicUrl(musicId){
    return new Promise((resolve, reject)=>{
        $.ajax(musicUrlAPI + musicId ).then((data)=>{
            data = JSON.parse(data)
            if (data["data"][0].url === undefined){
                resolve("")
            }else {
                resolve(data["data"][0].url)
            }
        }, () => {
            // reject(null)
        })
    })
}
function getMusicArrayBuffer(musicId){
    return new Promise((resolve) => {
        getMusicUrl(musicId).then((musicUrl) =>{
            // 歌曲收费无法获取连接
            if (musicUrl === ""){
                resolve("")
            }else if (musicUrl === null){
                // 请求接口失败 换个接口请求url
                // let baseUrl =
            }
            else {
                let request = new XMLHttpRequest()
                // 获取歌曲的bufferArray数据
                request.open('GET',musicUrl)
                request.responseType = 'arraybuffer'
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            let audioData = request.response
                            console.log(audioData)
                            resolve({"audioCtx":audioContext,"arrayBuffer": audioData})
                        } else {
                            resolve(null)
                        }
                    }
                }
                request.send()
            }
        })
    })
}
function getMusicLyric(musicId){
    return new Promise((resolve)=>{
        $.ajax(musicLyricAPI + musicId).then((data)=>{
            data = JSON.parse(data)
            if (data["lrc"] === undefined){
                resolve("")
            }else {
                resolve(data["lrc"].lyric)
            }
        },() => {
            // 换个接口请求
            // let baseUrl = `https://v1.hitokoto.cn/nm/lyric/`
        })
    })
}

function getMusicDetail(playingMusicId){
    return new Promise((resolve,reject)=>{
        getMusicArrayBuffer(playingMusicId).then((audioCtx) => {
            $.ajax(musicDetailAPI + playingMusicId).then((data)=>{
                data = JSON.parse(data)
                if (audioCtx === null){
                    songs["audioCtx"] = null
                }else if (audioCtx === ""){
                    songs["audioCtx"] = ""
                }else {
                    songs['audioCtx'] = audioCtx
                }
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
                },()=>{
                    //换个接口请求detail
                    // let baseUrl = 'https://v1.hitokoto.cn/nm/detail/'
                })
            })
            
        })
    })
}


export default function getMusicData (playingId){
    return  new Promise((resolve) => {
        if (localStorage.getItem("listName") === 'local'){
            if (localStorage.getItem("musicId") === null){
                getMusicId().then((listFirstId)=>{
                    getMusicDetail(listFirstId).then((songs) => {
                        localStorage.setItem("playingId", listFirstId + "")
                        resolve(songs)
                    })
                })
            }else {
                getMusicDetail(playingId).then((songs) => {
                    localStorage.setItem("playingId", playingId + "")
                    resolve(songs)
                })
            }
            
        }
        // else {
        //     getMusicDetail(playingId).then((songs) => {
        //         resolve(songs)
        //     })
        // }
    })
}