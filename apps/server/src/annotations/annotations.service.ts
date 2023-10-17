import { Injectable } from '@nestjs/common';
import { CreateAnnotationDto } from './dto/create-annotation.dto';
import { UpdateAnnotationDto } from './dto/update-annotation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Annotation } from './entities/annotation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private readonly annotationRepository: Repository<Annotation>,
  ) {}

  create(createAnnotationDto: CreateAnnotationDto) {
    const annotation = this.annotationRepository.create(createAnnotationDto);
    return this.annotationRepository.save(annotation);
  }

  findAll() {
    return `This action returns all annotations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} annotation`;
  }

  update(id: number, updateAnnotationDto: UpdateAnnotationDto) {
    return `This action updates a #${id} annotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} annotation`;
  }
}
