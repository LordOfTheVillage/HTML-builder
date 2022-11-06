const fs = require("fs")
const fsPromise = require("fs/promises")
const path = require("path")

buildProject(__dirname)

function buildProject(folderPath) {
  const destDirPath = path.join(folderPath, "/project-dist")
  fsPromise.mkdir(destDirPath, { recursive: true })
  copyDir(path.join(folderPath, "/assets"), path.join(destDirPath, "/assets"))
  joinStyles(
    path.join(folderPath, "/styles"),
    path.join(destDirPath, "/style.css")
  )
  buildHTMLFile(folderPath, path.join(destDirPath, "/index.html"))
}

async function buildHTMLFile(pathName, destPath) {
  const readStream = fs.createReadStream(path.join(pathName, "/template.html"))
  let content = ""
  readStream.on("data", (chunk) => (content += chunk.toString()))
  readStream.on("end", () => {
    replaceTemplates(content, pathName, destPath)
  })
}

async function replaceTemplates(content, pathName, destPath) {
  const firstIndex = content.indexOf("{{")
  const lastIndex = content.indexOf("}}")
  const tag = content.substring(firstIndex + 2, lastIndex)
  const outStream = fs.createReadStream(
    path.join(pathName, "components", tag + ".html")
  )
  let tagContent = ""
  outStream.on("data", (chunk) => (tagContent += chunk.toString()))
  outStream.on("end", () => {
    content = content.replace(`{{${tag}}}`, tagContent)
    if (content.includes("{{")) {
      replaceTemplates(content, pathName, destPath)
    } else {
      const inStream = fs.createWriteStream(destPath)
      inStream.write(content)
    }
  })
}

async function joinStyles(stylesPath, destPath) {
  fs.writeFile(destPath, "", (err) => {
    if (err) console.error(err)
  })

  try {
    const styles = await fsPromise.readdir(stylesPath, { withFileTypes: false })
    const inStream = fs.createWriteStream(destPath, "utf-8")

    for (const file of styles) {
      if (path.extname(file) !== ".css") continue
      const outStream = fs.createReadStream(
        path.join(stylesPath, file),
        "utf-8"
      )
      outStream.pipe(inStream)
    }
  } catch (error) {
    console.error(error)
  }
}

const cloneFiles = (main, copy, mainPath, copyPath) => {
  const set = [...main]
  ;[...copy].forEach((e) => {
    if (set.every((obj) => obj.name !== e.name)) {
      set.push(e)
    }
  })

  for (const file of set) {
    const name = file.name
    const hasName = [...main].every((e) => e.name !== name)

    if (!file.isDirectory()) {
      if (!hasName) {
        fsPromise.copyFile(path.join(mainPath, name), path.join(copyPath, name))
      } else {
        fsPromise.unlink(path.join(copyPath, name))
      }
    } else {
      hasName
        ? removeDir(path.join(copyPath, name))
        : copyDir(path.join(mainPath, name), path.join(copyPath, name))
    }
  }
}

async function copyDir(mainPath, copyPath) {
  try {
    fsPromise.mkdir(copyPath, { recursive: true })
    const mainFiles = await fsPromise.readdir(mainPath, { withFileTypes: true })
    const copyFiles = await fsPromise.readdir(copyPath, { withFileTypes: true })

    cloneFiles(mainFiles, copyFiles, mainPath, copyPath)
  } catch (error) {
    console.error(error)
  }
}

async function removeDir(pathName) {
  const dir = await fsPromise.readdir(pathName, { withFileTypes: true })

  for (file of dir) {
    const name = file.name
    if (file.isDirectory()) removeDir(path.join(pathName, name))
    else fsPromise.unlink(path.join(pathName, name))
  }

  fsPromise.rmdir(pathName)
}
