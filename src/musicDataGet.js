import $ from 'jquery'

const AudioContext = window.AudioContext || window.webkitAudioContext

let songs = {}
let musicUrlAPI = '/assets/musicInfo/url/'
let musicLyricAPI = '/assets/musicInfo/lyric/'
let musicDetailAPI = '/assets/musicInfo/detail/'
let musicIdAPI = '/assets/musicInfo/musicId.json'

// let musicUrlAPI = "https://api.imjad.cn/cloudmusic/?type=song&id="
// let musicUrlAPI = "https://v1.hitokoto.cn/nm/url/"
// let musicLyricAPI = "https://api.imjad.cn/cloudmusic/?type=lyric&id="
// let musicLyricAPI = "https://v1.hitokoto.cn/nm/lyric/"
// let musicDetailAPI = "https://api.imjad.cn/cloudmusic/?type=detail&id="
// let musicDetailAPI = "https://v1.hitokoto.cn/nm/detail/"
// null 请求失败  ”“ 请求成功但是没数据
// let musicIdUrl = "http://45.139.179.160:16333/musicData.json"
function getMusicId() {
  return new Promise((resolve) => {
    // 更新歌曲的接口
    $.ajax(musicIdAPI).done((data) => {
      localStorage.setItem('musicId', JSON.stringify(data))
      resolve(data['id'][0])
    })
  })
}

function getMusicUrl(musicId) {
  return new Promise((resolve) => {
    $.ajax(musicUrlAPI + musicId).then((data) => {
      data = JSON.parse(data)
      if (data['data'][0].url === undefined) {
        resolve('')
      } else {
        resolve(data['data'][0].url)
      }
    }, () => {
      // reject(null)
    })
  })
}

function getMusicLyric(musicId) {
  return new Promise((resolve) => {
    $.ajax(musicLyricAPI + musicId).then((data) => {
      data = JSON.parse(data)
      if (data['nolyric'] === true) {
        resolve('noLyric')
      } else if (data['lrc'] === undefined) {
        resolve('')
      } else {
        resolve(data['lrc'].lyric)
      }
    }, () => {
      // 换个接口请求
      // let baseUrl = `https://v1.hitokoto.cn/nm/lyric/`
    })
  })
}

function getMusicDetail(playingMusicId) {
  return new Promise((resolve) => {
    getMusicUrl(playingMusicId).then((url) => {
      songs['url'] = url
      $.ajax(musicDetailAPI + playingMusicId).then((data) => {
        data = JSON.parse(data)
        songs['name'] = data.songs[0].name
        songs['singer'] = []
        data.songs[0]['ar'].forEach((items) => {
          songs['singer'].push(items['name'])
        })
        songs['alia'] = data.songs[0].alia[0]
        songs['picUrl'] = data.songs[0].al.picUrl
        getMusicLyric(playingMusicId).then((lyric) => {
          songs['lyric'] = lyric
          resolve(songs)
        }, () => {
          //换个接口请求detail
          // let baseUrl = 'https://v1.hitokoto.cn/nm/detail/'
        })
      })
      
    })
  })
}

export default function getMusicData(playingId) {
  return new Promise((resolve) => {
    if (localStorage.getItem('listName') === 'local') {
      if (localStorage.getItem('musicId') === null) {
        getMusicId().then((listFirstId) => {
          getMusicDetail(listFirstId).then((songs) => {
            localStorage.setItem('playingId', listFirstId + '')
            resolve(songs)
          })
        })
      } else {
        getMusicDetail(playingId).then((songs) => {
          localStorage.setItem('playingId', playingId + '')
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