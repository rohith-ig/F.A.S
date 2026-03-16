-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AppointmentRequest" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyAvailability" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "facultyId" INTEGER NOT NULL,

    CONSTRAINT "FacultyAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "FacultyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyAvailability" ADD CONSTRAINT "FacultyAvailability_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "FacultyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
