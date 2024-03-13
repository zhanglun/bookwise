import { Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PublishersService {
  constructor(private prisma: PrismaService) {}

  async author(id: number): Promise<Publisher | null> {
    return this.prisma.author.findUnique({
      where: { id },
    });
  }

  async publishers(): Promise<Publisher[]> {
    return this.prisma.author.findMany();
  }

  async createPublisher(data: CreatePublisherDto): Promise<Publisher> {
    return this.prisma.author.create({
      data,
    });
  }

  async updatePublisher(
    id: number,
    data: UpdatePublisherDto,
  ): Promise<Publisher> {
    return this.prisma.author.update({
      data,
      where: { id },
    });
  }

  async deletePublisher(id: number): Promise<Publisher> {
    return this.prisma.author.delete({
      where: { id },
    });
  }
}
