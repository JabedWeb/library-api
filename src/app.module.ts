import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { StudentsModule } from './students/students.module';
import { OrdersModule } from './orders/orders.module';
import { PdfModule } from './pdf/pdf.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    AuthorsModule,
    CategoriesModule,
    BooksModule,
    StudentsModule,
    OrdersModule,
    PdfModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
