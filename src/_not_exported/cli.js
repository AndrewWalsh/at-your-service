#!/usr/bin/env node

const yargs = require("yargs");
const path = require("path");
const fs = require("fs");

const WORKER_FILENAME = "at-your-service-sw.js";

const copySwToDir = (yargs) => {
  const thisFileDir = __dirname;
  const thisProcessDir = process.cwd();

  const swFilePath = path.join(thisFileDir, WORKER_FILENAME);
  const targetDirFilePath = path.join(
    thisProcessDir,
    yargs["publicDir"],
    WORKER_FILENAME
  );

  fs.copyFile(swFilePath, targetDirFilePath, (err) => {
    if (err) throw err;
  });
};

yargs
  .usage(
    "$0 <publicDir>",
    `Copies service worker file ${WORKER_FILENAME} into a directory`,
    (yargs) => {
      return yargs.positional("publicDir", {
        type: "string",
        description:
          "Relative path to the public directory, usually called public or static",
        required: true,
        normalize: true,
      });
    },
    copySwToDir
  )
  .demandCommand()
  .help().argv;
