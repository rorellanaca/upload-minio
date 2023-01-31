
import { HttpStatus, Injectable } from '@nestjs/common';
import { Constants } from 'src/common/constants.enum';
import { BufferedFile } from 'src/interfaces/file.model';
import { generalReponse } from 'src/interfaces/reponse.model';
import { uploadRequestModel } from 'src/interfaces/request-upload.model';
import { MinioClientService } from './minio-client.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
    constructor(private minioClientService: MinioClientService) { }

    async uploadFile(file: BufferedFile, fileResquet: uploadRequestModel) {
        const uploaded_file = await this.minioClientService.upload(file, fileResquet);
        let reponse: generalReponse = {
            statusCode: HttpStatus.OK,
            message: `${Constants.MSG_SUCCESS_UPLOAD} - ${uploaded_file.fileName}`,
            uuid: uuidv4(),
            status: Constants.SUCCESSFUL
        }
        return reponse;
    }
}
