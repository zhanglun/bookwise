import { Injectable } from '@nestjs/common';
import { CreateAnnotationDto } from './dto/create-annotation.dto';
import { UpdateAnnotationDto } from './dto/update-annotation.dto';

@Injectable()
export class AnnotationsService {
  create(createAnnotationDto: CreateAnnotationDto) {
    return 'This action adds a new annotation';
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
