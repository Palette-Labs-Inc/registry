-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('PSN', 'BSN', 'GP');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('INITIATED', 'VERIFIED', 'INVALID');

-- CreateTable
CREATE TABLE "NodeEntry" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "callbackUrl" TEXT NOT NULL,
    "location" TEXT[],
    "industryCode" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "nodeType" "NodeType" NOT NULL,
    "status" "NodeStatus" NOT NULL,

    CONSTRAINT "NodeEntry_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "ServiceStat" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ServiceStat_pkey" PRIMARY KEY ("name")
);
