import $ from 'jquery'
import getMusicData from './musicDataGet'
import display from './pageDisplayUpdate'

localStorage.setItem('listName', 'local')
localStorage.setItem('isPlay', 'false')
localStorage.removeItem('color')
const playIngId = localStorage.getItem('playingId')
getMusicData(playIngId).then((songs) => {
  $('.cover').addClass('cover-animation-init')
  display(songs)
})