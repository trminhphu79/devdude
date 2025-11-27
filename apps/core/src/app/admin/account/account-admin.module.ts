import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountAdminService } from './account-admin.service';
import { AccountAdminController } from './account-admin.controller';
import { Account } from '../../shared/models/account';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [AccountAdminController],
  providers: [AccountAdminService],
  exports: [AccountAdminService],
})
export class AccountAdminModule {}
