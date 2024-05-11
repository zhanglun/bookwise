import { Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PublishersService {
  constructor(private prisma: PrismaService) {}

  async publisher(id: number): Promise<Publisher | null> {
    return this.prisma.publisher.findUnique({
      where: { id },
    });
  }

  public async findAll(): Promise<{
    total: number;
    items: Publisher[];
  }> {
    const fn = [
      this.prisma.publisher.findMany({
        include: {
          _count: {
            select: {
              books: true,
            },
          },
        },
      }),
      this.prisma.publisher.count(),
    ];
    const [record, total] = await Promise.all(fn);

    return {
      items: record as Publisher[],
      total: total as number,
    };
  }

  async createPublisher(data: CreatePublisherDto): Promise<Publisher> {
    return this.prisma.publisher.create({
      data,
    });
  }

  async updatePublisher(
    id: number,
    data: UpdatePublisherDto,
  ): Promise<Publisher> {
    return this.prisma.publisher.update({
      data,
      where: { id },
    });
  }

  async deletePublisher(id: number): Promise<Publisher> {
    return this.prisma.publisher.delete({
      where: { id },
    });
  }
}
