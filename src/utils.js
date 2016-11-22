module.exports = {
  textToSecs: (text) => {
    if(!text) {
      return false
    }
    let matches = text.match(/(\d+)(h|m|s)/g)
    let secs = 0
    matches.forEach((match) => {
      let i = parseInt(match, 10)
      if(match.includes('h')) {
        secs += i * 60 * 60
      } else if (match.includes('m')) {
        secs += i * 60
      } else {
        secs += i
      }
    });
    return secs
  }
}
