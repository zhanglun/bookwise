import { Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private publishersRepository: Repository<Publisher>,
  ) {}
  create(createPublisherDto: CreatePublisherDto) {
    return 'This action adds a new publisher';
  }

  async findOneOrCreate(createPublisherDto: CreatePublisherDto) {
    const author = await this.publishersRepository.findOne({
      where: { name: createPublisherDto.name },
    });

    if (author) {
      return author;
    } else {
      return await this.publishersRepository.save(createPublisherDto);
    }
  }

  findAll() {
    return `This action returns all publishers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publisher`;
  }

  update(id: number, updatePublisherDto: UpdatePublisherDto) {
    return `This action updates a #${id} publisher`;
  }

  remove(id: number) {
    return `This action removes a #${id} publisher`;
  }
}
