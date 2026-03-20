/*
  Warnings:

  - You are about to drop the column `cancellationNote` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppointmentRequest" ADD COLUMN     "cancellatioNote" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cancellationNote";
