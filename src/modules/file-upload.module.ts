import { Module } from '@nestjs/common';
import { FileUploadController } from 'src/controllers/file-upload.controller';
import { FileUploadService } from 'src/services/file-upload.service';
import { MinioClientModule } from './minio-client.module';

@Module({
    imports: [MinioClientModule],
    controllers: [FileUploadController],
    providers: [FileUploadService],
})
export class FileUploadModule { }
