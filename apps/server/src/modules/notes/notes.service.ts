import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-annotation.dto';
import { PrismaService } from 'src/prisma.service';
import { Filtering, Sorting, getOrder, getWhere } from './notes.decorator';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto) {
    const { book_id, position_metics, style_config, ...note } = createNoteDto;

    return this.prisma.note.create({
      data: {
        ...note,
        position_metics: JSON.stringify(position_metics),
        style_config: JSON.stringify(style_config),
        book: {
          connect: {
            id: book_id,
          },
        },
      },
    });
  }

  async findAll(sort?: Sorting, filter?: any) {
    console.log('🚀 ~ NotesService ~ findAll ~ filter:', filter);
    const order = getOrder(sort);
    const where = filter.map(getWhere).reduce((acu, cur) => {
      console.log('cur', cur);
      acu = { ...acu, ...cur };
      console.log('acu', acu);
      return acu;
    }, {});
    console.log('🚀 ~ NotesService ~ findAll ~ where:', where);
    const record = await this.prisma.note.findMany({
      orderBy: order,
      where: where,
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });

    return record;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
