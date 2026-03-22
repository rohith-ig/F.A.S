-- CreateTable
CREATE TABLE "AppointmentUsers" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentUsers_appointmentId_userId_key" ON "AppointmentUsers"("appointmentId", "userId");

-- AddForeignKey
ALTER TABLE "AppointmentUsers" ADD CONSTRAINT "AppointmentUsers_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "AppointmentRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentUsers" ADD CONSTRAINT "AppointmentUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
