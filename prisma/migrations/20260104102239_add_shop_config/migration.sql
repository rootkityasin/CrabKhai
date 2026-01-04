-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "measurementUnit" TEXT NOT NULL DEFAULT 'PCS',
ADD COLUMN     "shopName" TEXT NOT NULL DEFAULT 'Crab & Khai';
