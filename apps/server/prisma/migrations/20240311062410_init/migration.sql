/*
  Warnings:

  - You are about to drop the `PublisherBookRelationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublisherBookRelationship" DROP CONSTRAINT "PublisherBookRelationship_book_id_fkey";

-- DropForeignKey
ALTER TABLE "PublisherBookRelationship" DROP CONSTRAINT "PublisherBookRelationship_publisher_id_fkey";

-- DropTable
DROP TABLE "PublisherBookRelationship";

-- CreateTable
CREATE TABLE "_BookToPublisher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToPublisher_AB_unique" ON "_BookToPublisher"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToPublisher_B_index" ON "_BookToPublisher"("B");

-- AddForeignKey
ALTER TABLE "_BookToPublisher" ADD CONSTRAINT "_BookToPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToPublisher" ADD CONSTRAINT "_BookToPublisher_B_fkey" FOREIGN KEY ("B") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
