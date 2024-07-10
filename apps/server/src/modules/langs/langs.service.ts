import { Injectable } from '@nestjs/common';
import { CreateLangDto } from './dto/create-lang.dto';
import { UpdateLangDto } from './dto/update-lang.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LangsService {
  constructor(private prisma: PrismaService) {}
  create(createLangDto: CreateLangDto) {
    return 'This action adds a new lang';
  }

  findAll() {
    return this.prisma.language.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} lang`;
  }

  update(id: number, updateLangDto: UpdateLangDto) {
    return `This action updates a #${id} lang`;
  }

  remove(id: number) {
    return `This action removes a #${id} lang`;
  }
}
