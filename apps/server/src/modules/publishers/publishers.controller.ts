import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PaginatedResource } from '../books/dto/find-book.dto';
import { Publisher } from '@prisma/client';

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publishersService.createPublisher(createPublisherDto);
  }

  @Get()
  findAll(): Promise<PaginatedResource<Partial<Publisher>>> {
    return this.publishersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publishersService.publisher(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publishersService.updatePublisher(+id, updatePublisherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publishersService.deletePublisher(+id);
  }
}
