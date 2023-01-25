
import { Injectable } from '@nestjs/common';
import { BufferedFile } from 'src/interfaces/file.model';
import { uploadRequestModel } from 'src/interfaces/request-upload.model';
import { MinioClientService } from './minio-client.service';


@Injectable()
export class FileUploadService {
    constructor(private minioClientService: MinioClientService) { }

    async uploadFile(file: BufferedFile, fileResquet : uploadRequestModel) {
        const uploaded_file = await this.minioClientService.upload(file, fileResquet);

        return {
            image_url: uploaded_file.url,
            message: 'File upload successful',
        };
    }
}
