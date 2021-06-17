import $ from "jquery"
let localData = localStorage.getItem("musicId")
function getMusicId(){
    return new Promise((resolve) =>  {
        // 更新歌曲的接口
        $.ajax("http://45.139.179.160:16333/musicData.json").done((data)=>{
            localStorage.setItem("musicId",JSON.stringify(data))
            resolve(data["id"][0])
        })
    })
}

if (localData === null) {
    getMusicId().then((musicId) => {
        localStorage.setItem("playingId", JSON.stringify(musicId))
        localStorage.setItem("previousId", JSON.stringify(musicId))
    })
}

function getMusicUrl(musicId){
    return new Promise((resolve)=>{
        let baseUrl = "https://api.imjad.cn/cloudmusic/?type=song&id="
        $.ajax(baseUrl + musicId ).done((data)=>{
            resolve(data.data[0].url)
        })
    })
}

function getMusicDetail(musicId){
    return new Promise((resolve)=>{
        getMusicUrl(musicId).then((musicUrl) => {
            let baseUrl = "https://api.imjad.cn/cloudmusic/?type=detail&id="
            $.ajax(baseUrl + musicId ).done((data)=>{
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