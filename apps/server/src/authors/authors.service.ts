import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Repository } from 'typeorm';
import { Authors } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Authors)
    private authorsRepository: Repository<Authors>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    console.log(
      '🚀 ~ file: authors.service.ts:8 ~ AuthorsService ~ create ~ createAuthorDto:',
      createAuthorDto,
    );

    const record = await this.authorsRepository.save(createAuthorDto);

    return record;
  }

  findAll() {
    return `This action returns all authors`;
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
