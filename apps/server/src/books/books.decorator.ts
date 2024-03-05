import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
  property: string;
  direction: string;
}

export const SortingParams = createParamDecorator(
  (validParams: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;

    if (!sort) return null;

    // check if the valid params sent is an array
    if (typeof validParams != 'object')
      throw new BadRequestException('Invalid sort parameter');

    // check the format of the sort query param
    const sortPattern = /^([a-zA-Z0-9_.]+):(asc|desc)$/;
    if (!sort.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter');

    // extract the property name and direction and check if they are valid
    const [property, direction]: string[] = sort.split(':');
    if (!(validParams as string[]).includes(property))
      throw new BadRequestException(`Invalid sort property: ${property}`);

    return { property, direction };
  },
);

export interface Filtering {
  property: string;
  rule: string;
  value: string;
}

// valid filter rules
export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export const FilteringParams = createParamDecorator(
  (data, ctx: ExecutionContext): Filtering => {
    console.log('data===>', data);
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    // check if the valid params sent is an array
    if (typeof data != 'object')
      throw new BadRequestException('Invalid filter parameter');

    // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    if (
      !filter.match(
        /^[a-zA-Z0-9_.]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,\S]+$/,
      ) &&
      !filter.match(/^[a-zA-Z0-9_.]+:(isnull|isnotnull)$/)
    ) {
      throw new BadRequestException('Invalid filter parameter');
    }

    // extract the parameters and validate if the rule and the property are valid
    const [property, rule, value] = filter.split(':');
    if (!data.includes(property))
      throw new BadRequestException(`Invalid filter property: ${property}`);
    if (!Object.values(FilterRule).includes(rule as FilterRule))
      throw new BadRequestException(`Invalid filter rule: ${rule}`);

    return { property, rule, value };
  },
);

export const getOrder = (sort: Sorting) => {
  if (sort) {
    const [rs, key] = sort.property.split('.');
    if (key) {
      return {
        [rs]: {
          [key]: sort.direction,
        },
      };
    } else {
      return { [sort.property]: sort.direction };
    }
  }

  return {};
};
export const getWhere = (filter: any) => {
  if (!filter) return {};

  let shouldWrap = false;
  let property = filter.property;
  let wrapperKey = '';
  let res = {};

  if (filter.property.indexOf('.') > -1) {
    console.log(
      "%c Line:117 🥕 ilter.property.indexOf('.')",
      'color:#2eafb0',
      filter.property.indexOf('.'),
    );
    shouldWrap = true;
    wrapperKey = filter.property.split('.')[0];
    property = filter.property.split('.')[1];
  }

  if (filter.rule == FilterRule.IS_NULL) {
    res = { [property]: null };
  }

  if (filter.rule == FilterRule.IS_NOT_NULL)
    res = { [property]: { not: null } };
  if (filter.rule == FilterRule.EQUALS) {
    res = { [property]: filter.value };
  }
  if (filter.rule == FilterRule.NOT_EQUALS) {
    res = { [property]: { not: filter.value } };
  }
  if (filter.rule == FilterRule.GREATER_THAN)
    res = { [property]: { gt: filter.value } };
  if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS)
    res = { [property]: { gte: filter.value } };
  if (filter.rule == FilterRule.LESS_THAN)
    res = { [property]: { lt: filter.value } };
  if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS)
    res = { [property]: { lte: filter.value } };
  if (filter.rule == FilterRule.LIKE)
    res = { [property]: { contains: filter.value } };
  if (filter.rule == FilterRule.NOT_LIKE)
    res = { NOT: { [property]: { contains: filter.value } } };
  if (filter.rule == FilterRule.IN)
    res = { [property]: { in: filter.value.split(',') } };
  if (filter.rule == FilterRule.NOT_IN)
    res = { [property]: { notIn: filter.value.split(',') } };

  return shouldWrap ? { [wrapperKey]: { some: { ...res } } } : res;
};
