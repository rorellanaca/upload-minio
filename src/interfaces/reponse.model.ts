import { ApiProperty } from '@nestjs/swagger';
export class generalReponse{

    @ApiProperty({ type: String,description: 'This is a required property'})
    public uuid: string

    @ApiProperty({ type: String,description: 'This is a required property'})
    public status: string

    @ApiProperty({ type: String,description: 'This is a required property'})
    public statusCode: number

    @ApiProperty({ type: String,description: 'This is a required property'})
    public message: string

    @ApiProperty({ type: String,description: 'This is a required property'})
    public response?: any
}