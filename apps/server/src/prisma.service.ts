import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  annotations: any;
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }
}
