import $ from "jquery"

let audioPlayer = $(".audio-player")
let audioContext = null
let analyser = null
let source = null //the audio source
let frequency = []
//实例化一个音频上下文类型window.AudioContext。目前Chrome和Firefox对其提供了支持，但需要相应前缀，Chrome中为window.webkitAudioContext，Firefox中为mozAudioContext。
// 所以为了让代码更通用，能够同时工作在两种浏览器中，只需要一句代码将前缀进行统一即可。

try {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 32;//傅里叶变换参数 简化成16个元素数组
} catch (e) {
    console.log(e);
}

function getFrequencyData(url) {
    return new Promise(resolve => {
        source = audioContext.createBufferSource();
        let request = new XMLHttpRequest();
        //请求资源
        request.open('GET',url)
        request.responseType = 'arraybuffer';
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    ready = true
                } else {
                    loadFailed = true
                }
            }
        }
        request.onload = function () {
            let audioData = request.response;
            //解码
            audioContext.decodeAudioData(audioData).then((buffer) => {
                source.buffer = buffer
                //将source与分析器连接
                source.connect(analyser)
                audioPlayer[0].source = source
                console.log(source)
                //将分析器与destination连接，这样才能形成到达扬声器的通路
                analyser.connect(audioContext.destination)
                frequency = new Uint8Array(analyser.frequencyBinCount)
                resolve({source, analyser, frequency})
            })
        }
        request.send()
    })}
    
export default getFrequencyData

//  function play() {
//     source.start(0);
//     playing = true;
//     let timer = setInterval(function () {
//         analyser.getByteFrequencyData(frequency);
//         if (source.buffer){
//             if (audioContext.currentTime>source.buffer.duration){
//                 source.stop(0);
//                 playing = false;
//                 clearInterval(timer);
//             }
//         }
//     },100);
// }
