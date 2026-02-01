# Bookwise 项目开发指南

## 项目结构

Monorepo 项目使用 pnpm workspaces 管理：
- `apps/client` - React + Vite 前端应用
- `apps/server` - NestJS 后端应用
- `apps/common` - 共享代码
- `packages/*` - 共享包（如 foliate-js）

## 构建命令

### 客户端（apps/client）
```bash
# 开发模式
pnpm -F @bookwise/client dev

# 构建
pnpm -F @bookwise/client build

# 类型检查
pnpm -F @bookwise/client typecheck

# Lint
pnpm -F @bookwise/client lint

# Prettier 检查
pnpm -F @bookwise/client prettier

# Prettier 格式化
pnpm -F @bookwise/client prettier:write

# 测试
pnpm -F @bookwise/client vitest

# 测试监听模式
pnpm -F @bookwise/client vitest:watch

# 完整测试（类型检查 + prettier + lint + vitest + build）
pnpm -F @bookwise/client test
```

### 服务端（apps/server）
```bash
# 开发模式
pnpm -F @bookwise/server start:dev

# 调试模式
pnpm -F @bookwise/server start:debug

# 构建
pnpm -F @bookwise/server build

# Lint
pnpm -F @bookwise/server lint

# 测试
pnpm -F @bookwise/server test

# 单元测试
pnpm -F @bookwise/server test:watch

# E2E 测试
pnpm -F @bookwise/server test:e2e

# 测试覆盖率
pnpm -F @bookwise/server test:cov
```

### 运行单个测试
```bash
# 客户端 vitest
pnpm -F @bookwise/client vitest -- path/to/test.spec.tsx

# 服务端 jest
pnpm -F @bookwise/server test path/to/test.spec.ts
```

## 代码风格指南

### 前端（apps/client）

#### 组件定义
- **只使用函数组件**（不使用类组件）
- 使用 arrow function 声明命名组件：
  ```tsx
  export const ComponentName = (props: Props) => { ... }
  ```

#### 类型定义
- **Props**：使用 `interface` 定义
- **复杂类型/联合类型**：使用 `type`
- **常量枚举**：使用 `type` + `as const`

#### 命名约定
- **组件名**：PascalCase（如 `BookCover`, `MainLayout`）
- **文件名**：kebab-case（如 `book-cover.tsx`, `main-layout.tsx`）
- **变量/函数**：camelCase（如 `openBook`, `updateSidebar`）
- **常量**：UPPER_SNAKE_CASE 或 PascalCase（如 `FileFormat`）
- **Hook**：`use` 前缀（如 `useBook`, `useFileUpload`）

#### 导入顺序
1. React 内置（react, react-dom）
2. 第三方库（如 @mantine/core, lucide-react）
3. 内部模块（@/ 别名）
4. 相对路径
5. CSS Modules

```tsx
import { useState, useRef } from 'react';
import { ActionIcon } from '@mantine/core';
import { clsx } from 'clsx';
import { dal } from '@/dal';
import classes from './component.module.css';
```

#### 样式处理
- **TailwindCSS**：用于原子化样式
- **CSS Modules**：用于组件级样式（`.module.css`）
- **clsx** + **tailwind-merge**：条件样式合并

```tsx
import { clsx } from 'clsx';
import classes from './component.module.css';

<div className={clsx('bg-white p-4', classes.customClass, isActive && classes.active)} />
```

#### 状态管理
- **本地状态**：`useState`, `useRef`
- **全局状态**：Jotai atoms（定义在 `atoms/` 或相关模块中）
- **服务器状态**：@tanstack/react-query（通过 jotai-tanstack-query）

```tsx
import { atom, useAtom } from 'jotai';

// 原子定义
const sidebarCollapsedAtom = atom(false);

// 使用
const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
```

#### 错误处理
- 使用 `try-catch` 包装异步操作
- console.error 记录详细错误信息

```tsx
try {
  await operation();
} catch (error: any) {
  console.error('Operation failed:', { error, context });
}
```

### 后端（apps/server）

#### Controller 层
- 使用 NestJS 装饰器（@Controller, @Get, @Post, @Query, @Body, @Param）
- 路由使用 kebab-case（如 `/recently-add`, `/upload/files`）
- 使用自定义装饰器（@SortingParams, @FilteringParams）处理查询参数

```typescript
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  findAll(@SortingParams(['title', 'created_at']) sort?: Sorting): Promise<Result> {
    return this.booksService.findAll(sort);
  }
}
```

#### Service 层
- 使用 `@Injectable()` 装饰器
- 通过构造函数注入依赖
- 数据库交互使用 Prisma Service

```typescript
@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private authorsService: AuthorsService,
  ) {}

  async findAll() {
    return this.prisma.book.findMany({ include: { authors: true } });
  }
}
```

#### DTO 定义
- 使用 class 定义 DTO
- 简单属性直接定义，不需要装饰器

```typescript
export class UpdateAdditionalInfoDto {
  spine_index: string;
  read_progress: number;
}
```

#### 错误处理
- 使用 NestJS 内置异常类（如 `ConflictException`）
- Service 层抛出异常，Controller 层自动处理

```typescript
if (bookRecord) {
  throw new ConflictException(Message.resourceAlreadyExist);
}
```

## TypeScript 配置

### 前端（apps/client）
- **strict mode**: 开启
- **module**: ESNext
- **moduleResolution**: bundler
- **jsx**: react-jsx
- **路径别名**: `@/*` → `./src/*`

### 后端（apps/server）
- **strict mode**: 部分关闭（strictNullChecks: false, noImplicitAny: false）
- **module**: commonjs
- **experimentalDecorators**: 开启（用于 NestJS）
- **emitDecoratorMetadata**: 开启
- **路径别名**: `@ui` → `./src/components/ui`

## Lint 和 格式化

### 前端
- **ESLint**: eslint-config-mantine + typescript-eslint
- **Prettier**: 使用 `@ianvs/prettier-plugin-sort-imports` 自动排序导入
- **Stylelint**: stylelint-config-standard-scss

### 后端
- **ESLint**: @typescript-eslint/recommended + prettier
- **Prettier**: 2.x 版本

## Editor 配置

项目使用 `.editorconfig`:
- **缩进**: 2 空格
- **行尾**: LF
- **字符编码**: UTF-8
- **末尾空格**: 删除
- **文件末尾**: 添加换行符

## 数据库

### 前端
- 使用 **Drizzle ORM** + **PGLite**（本地数据库）
- Schema 定义在 `src/db/schema.ts`
- 迁移生成：`pnpm -F @bookwise/client db:generate`

### 后端
- 使用 **Prisma ORM**
- Schema 定义在 `prisma/schema.prisma`
- 使用 TypeScript 类型从 `@prisma/client`

## 注意事项

1. **不禁止 console**：前后端都关闭了 `no-console` 规则
2. **测试文件扩展名**: 前端使用 `.test.tsx`，后端使用 `.spec.ts`
3. **React 组件必须导出**：`react-refresh/only-export-components` 规则设为警告
4. **严格类型检查**：前端开启严格模式，避免使用 `any` 类型
5. **路径别名**：前端优先使用 `@/` 别名而非相对路径
