import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from '../interfaces/file.model'
import * as crypto from 'crypto';
import { uploadRequestModel } from 'src/interfaces/request-upload.model';

@Injectable()
export class MinioClientService {


    //#region vars
    private readonly logger: Logger;
    //#endregion

    /**
     * Creates an instance of MinioClientService.
     * @param {MinioService} minio
     * @memberof MinioClientService
     */
    constructor(private readonly minio: MinioService) {
        this.logger = new Logger('MinioService');
    }

    /**
     *
     * Get minio client
     * @readonly
     * @memberof MinioClientService
     */
    public get client() {
        return this.minio.client;
    }

    public async upload(
        file: BufferedFile,
        fileResquet : uploadRequestModel
    ) {
        const timestamp = Date.now().toString();
        const hashedFileName = crypto
            .createHash('md5')
            .update(timestamp)
            .digest('hex');
        const extension = file.originalname.substring(
            file.originalname.lastIndexOf('.'),
            file.originalname.length,
        );
        const metaData : any = {
            'Content-Type': file.mimetype,
        };

        // We need to append the extension at the end otherwise Minio will save it as a generic file
        const fileName = hashedFileName + extension;

        this.client.putObject(
            fileResquet.bucketName,
            fileResquet.path == '' ? fileName : `${fileResquet.path}/${fileName}`,
            file.buffer,
            metaData,
            function (err, res) {
                if (err) {
                    throw new HttpException(
                        'Error uploading file',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
        );

        return {
            url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
        };
    }

    async delete(objetName: string, fileResquet : uploadRequestModel) {
        this.client.removeObject(fileResquet.bucketName, objetName, function (err) {
            if (err)
                throw new HttpException(
                    'An error occured when deleting!',
                    HttpStatus.BAD_REQUEST,
                );
        });
    }
}
