import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateTaskMessageSwagger } from '../../common/constants/task-message-swagger.constants';

export class CreateTaskMessageDto {
    @ApiProperty(CreateTaskMessageSwagger.taskId)
    @IsNotEmpty()
    @IsUUID()
    taskId: string;

    @ApiProperty(CreateTaskMessageSwagger.authorId)
    @IsNotEmpty()
    @IsUUID()
    authorId: string;

    @ApiProperty(CreateTaskMessageSwagger.message)
    @IsNotEmpty()
    @IsString()
    message: string;
}
