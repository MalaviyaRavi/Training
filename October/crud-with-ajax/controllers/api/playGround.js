const fs = require("await-fs");

async function deleteFile() {
  try {
    await fs.unlink("../../public/img/default.png");
  } catch (error) {
    console.log(error);
  }
}

deleteFile();
