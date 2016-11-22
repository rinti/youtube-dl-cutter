const ArgumentParser = require('argparse').ArgumentParser

var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp: true,
  description: 'youtube cutter'
});
parser.addArgument(
  ['-f', '--file'],
  {
    help: 'Name of the file to cut'
  }
);
parser.addArgument(
  ['-u', '--url'],
  {
    help: 'url to youtube (or other service available through youtube-dl), requires `--output-file`'
  }
);
parser.addArgument(
  ['-o', '--outputfile'],
  {
    help: 'Output-filename, defaults to copy-file.mp3, e.g. "-o my-filename" will output my-filename.mp3'
  }
);
parser.addArgument(
  ['--from'],
  {
    help: 'From where to start cutting in the format of e.g. `1h30m20s` or `2m20s` or `20s`'
  }
);
parser.addArgument(
  ['--to'],
  {
    help: 'From where to stop cutting in the format of e.g. `1h30m20s` or `2m20s` or `20s`'
  }
);

module.exports = {
  parser
}
