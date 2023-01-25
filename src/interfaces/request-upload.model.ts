import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class uploadRequestModel {

    @ApiProperty({ type: String,description: 'This is a required property'})
    bucketName: string;

    @ApiProperty({ type: String, description: 'This is a required property'})
    path: string;
}