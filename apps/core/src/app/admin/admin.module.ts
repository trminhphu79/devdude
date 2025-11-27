import { Module } from '@nestjs/common';
import { AccountAdminModule } from './account/account-admin.module';

@Module({
  imports: [AccountAdminModule],
  exports: [AccountAdminModule],
})
export class AdminModule {}
