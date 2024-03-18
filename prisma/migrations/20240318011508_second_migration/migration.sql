/*
  Warnings:

  - A unique constraint covering the columns `[idNumber]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Person_idNumber_key" ON "Person"("idNumber");
