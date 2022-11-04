const fs = require("fs")
const path = require("path")
const pathName = path.join(__dirname, "/text.txt")
const outStream = fs.createReadStream(pathName)
outStream.on("data", (chunk) => {
  console.log(chunk.toString())
})
