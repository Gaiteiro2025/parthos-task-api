import { InternalServerErrorException } from "@nestjs/common";

export const handleError = (error: unknown, action: string, id?: string): void => {
    if (error instanceof Error) {
        throw new InternalServerErrorException(`Erro ao ${action}${id ? ` com ID ${id}` : ''}: ${error.message}`);
    }
    throw new InternalServerErrorException(`Erro desconhecido ao ${action}${id ? ` com ID ${id}` : ''}`);
}