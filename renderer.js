// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const getUserMedia = require('getusermedia')
const Speech = require('@google-cloud/speech')
const path = require('path')
const audio = require('audio-stream')
const pcm = require('pcm-stream')
const wave = require('./wave-stream')

const myPath = path.join(__dirname, '/auth.json')
    // adjust_path_to_os(__dirname + '/dexter-dev-env-b05da431ead6.json')

const speech = Speech({
  projectId: 'dexter-dev-env',
  keyFilename: myPath
})

    // from https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-speech-alpha
    // const speechClient = speech({
    //    projectId: 'dexter-dev-env',
    //   keyFilename:  adjust_path_to_os(__dirname + '/dexter-dev-env-b05da431ead6.json')
    // })

const request = { config: { encoding: 'LINEAR16', sampleRate: 16000 },
  singleUtterance: false,
  interimResults: false,
  verbose: true}
    // Create a recognize stream
const recognizeStream = speech.createRecognizeStream(request)
            .on('error', console.error)
            .on('data', function (data) { console.log(data) })
              // process.stdout.write(data.results)

    // Start recording and send the microphone input to the Speech API

getUserMedia({video: false, audio: true}, function (err, mediaStream) {
  if (err) return console.error(err)
  var w = wave()
  var sourceStream = audio(mediaStream)
  sourceStream
        .on('header', function (header) {
          var channels = header.channels
          var sampleRate = header.sampleRate
          w.setHeader({
            audioFormat: 1,
            channels: channels,
            sampleRate: sampleRate,
            byteRate: sampleRate * channels * 2,
            blockAlign: channels * 2,
            bitDepth: 16
          })
        })
        .pipe(pcm())
        .pipe(w)
        .pipe(recognizeStream)
})
