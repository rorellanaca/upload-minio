import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MinioClientModule } from './modules/minio-client.module';
import { FileUploadModule } from './modules/file-upload.module';

@Module({
  imports: [
    MinioClientModule,
    FileUploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
