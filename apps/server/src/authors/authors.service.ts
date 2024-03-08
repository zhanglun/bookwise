import { Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async author(id: number): Promise<Author | null> {
    return this.prisma.author.findUnique({
      where: { id },
    });
  }

  async authors(): Promise<Author[]> {
    return this.prisma.author.findMany();
  }

  async createAuthor(data: CreateAuthorDto): Promise<Author> {
    return this.prisma.author.create({
      data,
    });
  }

  async updateAuthor(id: number, data: UpdateAuthorDto): Promise<Author> {
    return this.prisma.author.update({
      data,
      where: { id },
    });
  }

  async deleteAuthor(id: number): Promise<Author> {
    return this.prisma.author.delete({
      where: { id },
    });
  }
}
