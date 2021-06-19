import $ from "jquery"

function getMusicUrl(musicId){
    return new Promise((resolve)=>{
        let baseUrl = "https://api.imjad.cn/cloudmusic/?type=song&id="
        $.ajax(baseUrl + musicId ).done((data)=>{
            resolve(data.data[0].url)
        })
    })
}

function getMusicDetail(PlayingMusicId){
    return new Promise((resolve)=>{
        getMusicUrl(PlayingMusicId).then((musicUrl) => {
            let baseUrl = "https://api.imjad.cn/cloudmusic/?type=detail&id="
            $.ajax(baseUrl + PlayingMusicId ).done((data)=>{
                let songs = {}
                songs["musicUrl"] = musicUrl
                songs["name"] = data.songs[0].name
                songs["singer"] = []
                data.songs[0]["ar"].forEach((items) => {
                    songs["singer"].push(items["name"])
                })
                songs["alia"] =  data.songs[0].alia[0]
                songs["picUrl"] = data.songs[0].al.picUrl
                resolve(songs)
            })
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