import { Module } from '@nestjs/common';
import { AccountAdminModule } from './account-admin.module';

@Module({
  imports: [AccountAdminModule],
  exports: [AccountAdminModule],
})
export class AccountModule {}
