import $ from 'jquery'

const AudioContext = window.AudioContext || window.webkitAudioContext

let songs = {}
let musicUrl = 'http://152.136.211.162:8888/mp3/musicInfo/url/'
let musicLyric = 'http://152.136.211.162:8888/mp3/musicInfo/lyric/'
let musicDetail = 'http://152.136.211.162:8888/mp3/musicInfo/detail/'
let musicId = 'http://152.136.211.162:8888/mp3/musicInfo/musicId.json'

function getMusicId() {
  return new Promise((resolve) => {
    // 更新歌曲的接口
    $.ajax(musicId).done((data) => {
      localStorage.setItem('musicId', data)
      resolve(JSON.parse(data)['id'][0])
    })
  })
}

function getMusicUrl(musicId) {
  return new Promise((resolve) => {
    $.ajax(musicUrl + musicId + '.json').then((data) => {
      data = JSON.parse(data)
      if (data['data'][0].url === undefined) {
        resolve('')
      } else {
        resolve(data['data'][0].url)
      }
    })
  })
}

function getMusicLyric(musicId) {
  return new Promise((resolve) => {
    $.ajax(musicLyric + musicId + '.json').then((data) => {
      data = JSON.parse(data)
      if (data['nolyric'] === true) {
        resolve('noLyric')
      } else if (data['lrc'] === undefined) {
        resolve('')
      } else {
        resolve(data['lrc'].lyric)
      }
    })
  })
}

function getMusicDetail(musicId){
  return new Promise(((resolve, reject) => {
    $.ajax(musicDetail + musicId + '.json').then((data) => {
      data = JSON.parse(data)
      resolve(data)
    })
  }))
}

function getMusicAll(musicId) {
  return new Promise((resolve) => {
    const songs = {}
    getMusicUrl(musicId).then((url) => {
      songs['url'] = url
      return getMusicDetail(musicId)
    }).then((data) => {
      songs['name'] = data.songs[0].name
      songs['singer'] = []
      data.songs[0]['ar'].forEach((items) => {
        songs['singer'].push(items['name'])
      })
      songs['alia'] = data.songs[0].alia[0]
      songs['picUrl'] = data.songs[0].al.picUrl
      return getMusicLyric(musicId)
    }).then((lyric) => {
      songs['lyric'] = lyric
      resolve(songs)
    }).catch((error) => {console.log(error)})
  })
}

export default function getMusicData(playingId) {
  return new Promise((resolve) => {
    if (localStorage.getItem('listName') === 'local') {
      if (localStorage.getItem('musicId') === null) {
        getMusicId().then((listFirstId) => {
          localStorage.setItem('playingId', listFirstId + '')
          return getMusicAll(listFirstId)
        }).then((songs) => {
          resolve(songs)
        })
      }else {
        if (localStorage.getItem('musicId') === null){
          const musicId = JSON.parse(localStorage.getItem('musicId')).id[0]
          console.log(musicId)
          getMusicAll(musicId).then((songs) => {resolve(songs)})
        }else {
          getMusicAll(playingId).then((songs) => {resolve(songs)})
        }
      }
    }
  })
}