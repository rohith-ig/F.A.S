/*
  Warnings:

  - You are about to drop the column `duration` on the `AppointmentRequest` table. All the data in the column will be lost.
  - Added the required column `end` to the `AppointmentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppointmentRequest" DROP COLUMN "duration",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL;
