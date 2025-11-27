import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { testSharedFunc } from '@devdue/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getData() {
    testSharedFunc();
    return this.appService.getData();
  }
}
