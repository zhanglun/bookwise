import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    console.log(
      '🚀 ~ file: authors.service.ts:8 ~ AuthorsService ~ create ~ createAuthorDto:',
      createAuthorDto,
    );

    const record = await this.authorsRepository.save(createAuthorDto);

    return record;
  }

  async findOneOrCreate(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorsRepository.findOne({
      where: { name: createAuthorDto.name },
    });

    if (author) {
      return author;
    } else {
      return await this.authorsRepository.save(createAuthorDto);
    }
  }

  async findAll() {
    const [authors, total] = await this.authorsRepository.findAndCount();

    return {
      items: authors,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
