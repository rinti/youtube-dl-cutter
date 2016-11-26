const fs = require('fs')

const chai = require('chai')
const expect = chai.expect

const parser = require('../src/parser').parser
const textToSecs = require('../src/utils').textToSecs
const execSync = require('child_process').execSync



/***
Todo: Mock server that returns the file, instead of this slow "real" stuff.
***/

describe('ytcut', (done) => {
  // shamelessly loaning the youtube-dl test clip
  let test_url = 'https://www.youtube.com/watch?v=BaW_jenozKc'


  it('should download a file when spicifying a url and it should work without specifing --from or', () => {
    execSync(`ytcut -u ${test_url} -o test`)
    expect(fs.existsSync('test.mp3')).to.equal(true) 
    expect(fs.existsSync('testtemp.mp3')).to.equal(false) 

    let duration = execSync("ffmpeg -i test.mp3  2>&1 | grep Duration | awk '{print $2}' | tr -d ,")

    // 00:00:10.559 -> 10 
    let secs = parseInt(Math.round(duration.toString().split(':')[2]), 10)
    expect(secs).to.equal(10)

    execSync('rm test.mp3')
  })

  it('should be possible to save a file with spaces in it', () => {
    execSync(`ytcut -u ${test_url} -o "test lorem ipsum"`)
    expect(fs.existsSync('test lorem ipsum.mp3')).to.equal(true) 
    expect(fs.existsSync('test lorem ipsumtemp.mp3')).to.equal(false) 

    let duration = execSync("ffmpeg -i \"test lorem ipsum.mp3\"  2>&1 | grep Duration | awk '{print $2}' | tr -d ,")

    // 00:00:10.559 -> 10 
    let secs = parseInt(Math.round(duration.toString().split(':')[2]), 10)
    expect(secs).to.equal(10)

    execSync('rm "test lorem ipsum.mp3"')
  })

  it('and the cut file should be cut', () => {
    execSync(`ytcut -u ${test_url} -o test_cut --from 5s --to 10s`)
    expect(fs.existsSync('test_cut.mp3')).to.equal(true) 
    expect(fs.existsSync('test_cuttemp.mp3')).to.equal(false) 
    let duration = execSync("ffmpeg -i test_cut.mp3  2>&1 | grep Duration | awk '{print $2}' | tr -d ,")

    // the original file ^ up there is 10s long
    // 00:00:04.559 -> 5
    let secs = parseInt(Math.round(duration.toString().split(':')[2]), 10)
    expect(secs).to.equal(5)
    execSync('rm test_cut.mp3')
  })

  it('should work with a local file', () => {
    execSync(`ytcut -u ${test_url} -o test`)

    execSync(`ytcut -f test.mp3 -o test_cut.mp3 --from 5s --to 10s`)

    // 00:00:04.559 -> 5 
    let duration = execSync("ffmpeg -i test_cut.mp3  2>&1 | grep Duration | awk '{print $2}' | tr -d ,")
    let secs = parseInt(Math.round(duration.toString().split(':')[2]), 10)
    expect(secs).to.equal(5)

    execSync('rm test.mp3')
    execSync('rm test_cut.mp3')
  })

})


describe('arguments', () => {
  it('should respect all the defined arguments', () => {
    var args

    args = parser.parseArgs('-f cool'.split(' '))
    expect(args.file).to.equal('cool')
    args = parser.parseArgs('--file cool'.split(' '))
    expect(args.file).to.equal('cool')

    args = parser.parseArgs('-u http://test.com'.split(' '))
    expect(args.url).to.equal('http://test.com')
    args = parser.parseArgs('--url http://test.com'.split(' '))
    expect(args.url).to.equal('http://test.com')

    args = parser.parseArgs('-o test'.split(' '))
    expect(args.outputfile).to.equal('test')
    args = parser.parseArgs('--outputfile test'.split(' '))
    expect(args.outputfile).to.equal('test')

    args = parser.parseArgs('--from test'.split(' '))
    expect(args.from).to.equal('test')

    args = parser.parseArgs('--to test'.split(' '))
    expect(args.to).to.equal('test')
  })
})

describe('textToSecs', () => {
  it('parse hours, minutes and seconds alone correctly', () => {
    expect(textToSecs('1h')).to.equal(1*60*60)
    expect(textToSecs('0h')).to.equal(0)
    expect(textToSecs('1m')).to.equal(1*60)
    expect(textToSecs('0m')).to.equal(0)
    expect(textToSecs('1s')).to.equal(1)
    expect(textToSecs('0s')).to.equal(0)
  })
  it('parse different combinations correctly', () => {
    expect(textToSecs('1h1s')).to.equal(1*60*60 + 1)
    expect(textToSecs('0h20s')).to.equal(20)
    expect(textToSecs('1m20s')).to.equal(1*60 + 20)
    expect(textToSecs('20m2h')).to.equal(20*60 + 2*60*60)
    expect(textToSecs('1000s1m')).to.equal(1000 + 60)
    expect(textToSecs('000s10h')).to.equal(0 + 10*60*60)
  })
})
