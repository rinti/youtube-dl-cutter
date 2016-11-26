# youtube-dl-cutter

Effectively cuts from `--from X` into the file until `--to X` into the file.

Example: `ytcut -u https://www.youtube.com/watch?v=BaW_jenozKc -o "test clip" --from 2s --to 8s`

## requirements
  * youtube-dl (used to download the file)
  * ffmpeg (used to cut the file)

## running tests
  npm run test

## installation
  clone this repo and `npm i -g`
