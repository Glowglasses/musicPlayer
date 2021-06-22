import $ from "jquery"

function getMusicUrl(musicId){
    return new Promise((resolve)=>{
        let baseUrl = "https://api.imjad.cn/cloudmusic/?type=song&id="
        $.ajax(baseUrl + musicId ).done((data)=>{
            resolve(data.data[0].url)
        })
    })
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
        getMusicUrl(playingMusicId).then((musicUrl) => {
            if (musicUrl === undefined || musicUrl === ""){
               resolve([])
            }else {
                let baseUrl = "https://api.imjad.cn/cloudmusic/?type=detail&id="
                $.ajax(baseUrl + playingMusicId ).done((data)=>{
                    let songs = {}
                    songs["musicUrl"] = musicUrl
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