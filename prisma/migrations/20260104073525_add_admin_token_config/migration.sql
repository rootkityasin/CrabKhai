-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "adminSetupToken" TEXT NOT NULL DEFAULT 'crab-secret-setup-123';
