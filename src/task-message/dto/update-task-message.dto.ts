import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UpdateTaskMessageSwagger } from '../../common/constants/task-message-swagger.constants';
import { CreateTaskMessageDto } from './create-task-message.dto';

export class UpdateTaskMessageDto extends PartialType(CreateTaskMessageDto) {
    @ApiProperty(UpdateTaskMessageSwagger.message)
    @IsOptional()
    @IsString()
    message?: string;
}
