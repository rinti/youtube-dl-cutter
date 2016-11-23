#!/usr/bin/env node

const textToSecs = require('./src/utils').textToSecs
const args = require('./src/parser').parser.parseArgs()
const execSync = require('child_process').execSync

let file = args.file
let output_filename = args.outputfile ? args.outputfile : `copy-${file}`

let from_secs = textToSecs(args.from)
let to_secs = textToSecs(args.to) - from_secs

if(args.url) {
  execSync(`youtube-dl ${args.url} -o '${args.outputfile}.$(ext)s' --extract-audio --audio-format mp3`)
  file = `${args.outputfile}.mp3`
  if(from_secs || to_secs) {
    output_filename += 'temp.mp3'
  }
}


if(from_secs && to_secs) {
  execSync(`ffmpeg -ss ${from_secs} -t ${to_secs} -i "${file}" -acodec copy "${output_filename}"`)
}

// remove the downloaded file, and replace it with the cut file.
if(args.url && (from_secs || to_secs)) {
  execSync(`rm "${file}" && mv "${output_filename}" "${file}"`)
}
