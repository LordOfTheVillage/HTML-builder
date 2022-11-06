const fs = require("fs")
const fsPromise = require("fs/promises")
const path = require("path")
const stylesPath = path.join(__dirname, "/styles")
const destPath = path.join(__dirname, "/project-dist", "bundle.css")

joinStyles(stylesPath, destPath)

async function joinStyles(stylesPath, destPath) {
  fs.writeFile(destPath, "", (err) => {
    if (err) console.error(err)
  })
  const styles = await fsPromise.readdir(stylesPath, { withFileTypes: false })
  const inStream = fs.createWriteStream(destPath, "utf-8")

  for (const file of styles) {
    if (path.extname(file) !== ".css") continue
    const outStream = fs.createReadStream(path.join(stylesPath, file), "utf-8")
    outStream.pipe(inStream)
  }
}
