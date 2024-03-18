-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_destinationAccount_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_originAccount_fkey";

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_originAccount_fkey" FOREIGN KEY ("originAccount") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_destinationAccount_fkey" FOREIGN KEY ("destinationAccount") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
