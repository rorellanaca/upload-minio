import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/interfaces/file.model';
import { uploadRequestModel } from 'src/interfaces/request-upload.model';
import { FileUploadService } from 'src/services/file-upload.service';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('minIO')
@Controller('minIO')
export class FileUploadController {

    constructor(private fileUploadService: FileUploadService) { }

    @Post('uploadFile')
    @ApiOperation({ summary: 'Upload File' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: BufferedFile, @Body() fileResquet: uploadRequestModel) {
        console.log(file)
        console.log(fileResquet)
        //let request: uploadRequestModel = { bucketName: fileResquet["bucketName"], path: fileResquet["path"] };
        return await this.fileUploadService.uploadFile(file, fileResquet);
    }

}
