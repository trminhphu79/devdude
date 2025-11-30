import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountAdminService } from './account-admin.service';
import { CreateAdminDto, UpdateAccountDto, UserRole } from '@devdude/common';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Accounts')
@ApiBearerAuth('X-Access-Token')
@Roles(UserRole.ADMIN)
@Controller('accounts')
export class AccountAdminController {
  constructor(private readonly accountAdminService: AccountAdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create new account (admin only)' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  create(@Body() dto: CreateAdminDto) {
    return this.accountAdminService.createAccount(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts with optional filters' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  findAll(
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string
  ) {
    const filters: any = {};
    if (role) filters.role = role;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (search) filters.search = search;

    return this.accountAdminService.findAllAccounts(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findOne(@Param('id') id: string) {
    return this.accountAdminService.findAccountById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountAdminService.updateAccount(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete account (set isActive to false)' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  remove(@Param('id') id: string) {
    return this.accountAdminService.deleteAccount(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle account active status' })
  @ApiResponse({
    status: 200,
    description: 'Account status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  toggleStatus(@Param('id') id: string) {
    return this.accountAdminService.toggleAccountStatus(id);
  }
}
