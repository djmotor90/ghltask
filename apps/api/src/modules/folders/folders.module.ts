import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FoldersService],
  exports: [FoldersService],
})
export class FoldersModule {}
