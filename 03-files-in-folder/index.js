const fs = require("fs/promises")
const path = require("path")
const pathName = path.join(__dirname, "/secret-folder")

getFolderInformation(pathName)

async function getFolderInformation(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true })
    for (const file of files) {
      if (file.isDirectory()) continue
      const name = file.name
      const stats = await fs.stat(path.join(folderPath, name), (err) => {
        if (err) console.error(err)
      })
      console.log(
        file.name +
          " - " +
          path.extname(file.name) +
          " - " +
          toKB(stats.size) +
          "Kb"
      )
    }
  } catch (error) {
    console.error(error)
  }
}

function toKB(bites) {
  return bites * 0.000977
}
