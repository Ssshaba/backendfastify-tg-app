-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "hobbies" TEXT,
ADD COLUMN     "photoLink" TEXT DEFAULT 'https://persikivk.ru/uploads/avatar.png';
