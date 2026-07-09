import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export function createImageUploadOptions(destination: string) {
  return {
    storage: diskStorage({
      destination,
      filename: (_req, file, callback) => {
        const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    }),
    fileFilter: (
      _req: unknown,
      file: { mimetype: string },
      callback: (error: Error | null, accept: boolean) => void,
    ) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp|gif)$/)) {
        callback(new BadRequestException('يجب أن يكون الملف صورة'), false);
        return;
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  };
}
