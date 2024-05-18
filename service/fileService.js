import { v4 as uuidv4 } from "uuid";
import { resolve } from "path";

class FileService {
    saveFile(file) {
        try {
            const fileName = uuidv4() + ".jpg";
            const filePath = resolve("static", fileName);
            file.mv(filePath);
            return fileName;
        } catch (e) {
            console.log(e);
        }
    }
}

export const fileService = new FileService();
