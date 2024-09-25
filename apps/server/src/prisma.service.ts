import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PGlite } from '@electric-sql/pglite';
import { PrismaPGlite } from 'pglite-prisma-adapter';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const client = new PGlite(connectionString);
    const adapter = new PrismaPGlite(client);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
