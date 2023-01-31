import { Body, Controller, Post, UploadedFile, UseInterceptors, HttpStatus, HttpException, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/interfaces/file.model';
import { uploadRequestModel } from 'src/interfaces/request-upload.model';
import { FileUploadService } from 'src/services/file-upload.service';

import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { generalReponse } from 'src/interfaces/reponse.model';
import { MinioClientService } from 'src/services/minio-client.service';

@ApiBearerAuth()
@ApiTags('minIO')
@Controller('minIO')
export class FileUploadController {

    constructor(private fileUploadService: FileUploadService, private minioClientServices: MinioClientService) { }

    @Post('uploadFile')
    @ApiOperation({ summary: 'Upload File' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({type:generalReponse})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                bucketName: { type: 'string' },
                path: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: BufferedFile, @Body() fileResquet: uploadRequestModel): Promise<generalReponse> {
        return await this.fileUploadService.uploadFile(file, fileResquet);
    }

    @Get()
    async listByClient(@Query('bucketName') bucketName: string, @Query('path') path: string) {
        return await this.minioClientServices.getObjectByClient(bucketName, path)
    }
}
