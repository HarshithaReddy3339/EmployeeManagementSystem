
import 'dotenv/config';

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private isMock = false;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.warn('[AI Studio] DATABASE_URL not defined — using mock PrismaService');
      const noOp = {
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        count: async () => 0,
        groupBy: async () => [],
        create: async (d: { data?: unknown }) => d?.data ?? {},
        update: async (d: { data?: unknown }) => d?.data ?? {},
        updateMany: async () => ({ count: 0 }),
        delete: async () => ({}),
      };
      super({ adapter: new PrismaPg({ connectionString: 'postgresql://localhost:5432/mock' }) });
      this.isMock = true;
      return new Proxy(this, {
        get(target, prop) {
          if (prop in target) {
            return Reflect.get(target, prop);
          }
          return noOp;
        },
      });
    }

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    if (this.isMock) return;
    try {
      await this.$connect();
    } catch {
      console.warn('[AI Studio] Database not connected — mock active');
      this.isMock = true;
    }
  }

  async onModuleDestroy() {
    if (this.isMock) return;
    await this.$disconnect();
  }
}
