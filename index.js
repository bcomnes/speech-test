const record = require('node-record-lpcm16'); // [START speech_streaming_mic_recognize]
    const Speech = require('@google-cloud/speech'); // Imports the Google Cloud client library
    //const speech = Speech() // Instantiates a client
    const my_path = __dirname + '/auth.json'
    //adjust_path_to_os(__dirname + '/dexter-dev-env-b05da431ead6.json')
    console.log("my_path is" +
        ":" + my_path)
    const speech = Speech({
        projectId: 'dexter-dev-env',
        keyFilename: my_path
    })

    //from https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-speech-alpha
    //const speechClient = speech({
    //    projectId: 'dexter-dev-env',
    //   keyFilename:  adjust_path_to_os(__dirname + '/dexter-dev-env-b05da431ead6.json')
    //})

    const request = { config: { encoding: 'LINEAR16',  sampleRate: 16000 },
                      singleUtterance: false,
                      interimResults: false,
                      verbose: true};
    // Create a recognize stream
    const recognizeStream = speech.createRecognizeStream(request)
            .on('error', console.error)
            .on('data', function(data){console.log(data)})
              //process.stdout.write(data.results)

    // Start recording and send the microphone input to the Speech API
    record.start({
        sampleRate: 16000,
        threshold: 0
    }).pipe(recognizeStream);
    console.log('Listening, press Ctrl+C to stop.');