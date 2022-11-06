const fs = require("fs")
const { stdin, stdout } = process
const path = require("path")
const pathName = path.join(__dirname, "/text.txt")

stdout.write("Please, type your text here:\n")

stdin.on("data", (data) => {
  const string = data.toString()
  if (string.trim().toLowerCase() == "exit") process.exit()

  fs.appendFile(pathName, string, (err) => {
    if (err) throw err
  })
})

process.on("SIGINT", () => process.exit())
process.on("exit", () => stdout.write("Goodbye!"))
