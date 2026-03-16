/*
  Warnings:

  - Added the required column `purpose` to the `AppointmentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppointmentRequest" ADD COLUMN     "note" TEXT,
ADD COLUMN     "purpose" TEXT NOT NULL;
