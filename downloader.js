const throughParallel = require("through2-parallel");
const fromArray = require("from2-array");
const fs = require("fs");
const https = require("https");
let videos = [],
  subtitles = [];
let destination = "";

module.exports = downloader;

function downloader(videoLinks, subtitleLinks, directory) {
  videos = videoLinks;
  subtitles = subtitleLinks;
  destination = directory;

  fromArray
    .obj(subtitleLinks)
    .pipe(
      throughParallel.obj({
          concurrency: 3
        },
        ({
          subtitleFileName,
          subtitleLink
        }, enc, next) => {
          console.log("Downloading:" + subtitleFileName);
          https.get(subtitleLink, req => {
            subtitleLinks.shift();
            req.pipe(
              fs
              .createWriteStream(directory + "/" + subtitleFileName)
              .on("finish", () => {
                console.log(subtitleFileName + " downloaded");
                next();
              })
            );
          });
        }
      )
    )
    .on("finish", () => console.log("All subtitle downloaded"));

  fromArray
    .obj(videoLinks)
    .pipe(
      throughParallel.obj({
          concurrency: 3
        },
        ({
          fileName,
          videoLink
        }, enc, next) => {
          console.log("Downloading:" + fileName);
          https.get(videoLink, req => {
            videoLinks.shift();
            req.pipe(
              fs
              .createWriteStream(directory + "/" + fileName)
              .on("finish", () => {
                console.log(fileName + " downloaded");
                next();
              })
            );
          });
        }
      )
    )
    .on("finish", () => console.log("All video downloaded"));
}

process.on("uncaughtException", function (err) {
  console.log(err);
  downloader(videos, subtitles, destination);
});
