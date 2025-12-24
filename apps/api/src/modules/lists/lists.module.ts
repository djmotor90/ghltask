import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ListsService],
  exports: [ListsService],
})
export class ListsModule {}
