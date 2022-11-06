const fs = require("fs/promises")
const path = require("path")
const directoryPath = path.join(__dirname, "/files")
const directoryCopyPath = path.join(__dirname, "/files-copy")

copyDir(directoryPath, directoryCopyPath)

const cloneFiles = (main, copy, mainPath, copyPath) => {
  const set = new Set([...main, ...copy])
  for (const name of set) {
    if ([...main].includes(name)) {
      fs.copyFile(path.join(mainPath, name), path.join(copyPath, name))
    } else {
      fs.unlink(path.join(copyPath, name))
    }
  }
}
async function copyDir(mainPath, copyPath) {
  try {
    fs.mkdir(copyPath, { recursive: true })
    const mainFiles = await fs.readdir(mainPath, { withFileTypes: false })
    const copyFiles = await fs.readdir(copyPath, { withFileTypes: false })

    cloneFiles(mainFiles, copyFiles, mainPath, copyPath)
  } catch (error) {
    console.error(error)
  }
}
