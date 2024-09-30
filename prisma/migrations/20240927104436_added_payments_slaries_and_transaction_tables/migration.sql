-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ADMISSION_FEE', 'MONTHLY_FEE', 'EXAM_FEE', 'OTHERS');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('MONTHLY_SALARY', 'BONOUS', 'OTHERS');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "payments" (
    "paymentId" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "salaries" (
    "trxId" TEXT NOT NULL,
    "type" "SalaryType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("trxId")
);

-- CreateTable
CREATE TABLE "transactions" (
    "trxId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("trxId")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
