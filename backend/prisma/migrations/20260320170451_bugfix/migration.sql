/*
  Warnings:

  - You are about to drop the column `cancellatioNote` on the `AppointmentRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppointmentRequest" DROP COLUMN "cancellatioNote",
ADD COLUMN     "cancellationNote" TEXT;
