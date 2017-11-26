const images = require("images");
const path = require("path");
const fs = require('fs');

const buildResizeImageInPublicFolder = async(fileName, width) => {
    return new Promise((resolve, reject) => {
        let oriFilePath = path.resolve(__dirname, `../../public/${fileName}`);
        let fileExtension = path.extname(fileName);
        let baseFileName = path.basename(fileName, fileExtension);
        let resultFilePath = path.resolve(__dirname, `../../public/resizeImage/${baseFileName}_${width}${fileExtension}`);
        fs.stat(resultFilePath, (err,stats) => {
            if(err) //圖不存在，用原圖Resize
            {
                fs.stat(oriFilePath, function (err, stats) {
                    if (err) { //原圖也不存在，回傳null
                        resolve(null);
                    }
                    else {                     
                        images(path.resolve(__dirname, `../../public/${fileName}`))
                            .size(width)
                            .save(
                                resultFilePath,
                                fileExtension
                            );
                        resolve(fs.createReadStream(resultFilePath));
                    }
                })
            }
            else //圖已存在，直接回傳
                resolve(fs.createReadStream(resultFilePath));
        })
        
    });
}
//buildResizeImageInPublicFolder('Chrysanthemum.jpg', 100);
module.exports = { buildResizeImageInPublicFolder };
