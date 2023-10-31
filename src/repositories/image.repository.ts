import { sqlPool } from "../db/sql.pool";
import { CreateImageDto } from "../dtos/imagesDtos/createImageDto";
import { ImageDto } from "../dtos/imagesDtos/imageDto";
import { arrayToStringWithQuotes } from "../utils/request.util";

export class ImageRepository {
    async addImage(newImage: CreateImageDto) {
        const values = [
            ...Object.values(newImage),
        ];
    
        const queryText = `INSERT INTO Image (id, url, urlMin) VALUES (${arrayToStringWithQuotes(values)});`;
    
        return new Promise<void>((resolve, reject) => {
            sqlPool.query(queryText, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    
    async getImageById(imageId: string) {
        const queryText = `SELECT * FROM Image WHERE id = '${imageId}';`;
    
        return new Promise<ImageDto | null>((resolve, reject) => {
            sqlPool.query(queryText, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                if (res.length === 0) {
                    resolve(null); 
                } else {
                    resolve(res[0]);
                }
            });
        });
    }

    async deleteImageById(imageId: string) {
        const queryText = `DELETE FROM Image WHERE id = '${imageId}';`;
    
        return new Promise<void>((resolve, reject) => {
            sqlPool.query(queryText, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    
    
}