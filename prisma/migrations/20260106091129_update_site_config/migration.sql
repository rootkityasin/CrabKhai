-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "totalSold" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "primaryColor" TEXT NOT NULL DEFAULT '#E60000',
ADD COLUMN     "secondaryColor" TEXT NOT NULL DEFAULT '#0f172a',
ALTER COLUMN "allergensText" SET DEFAULT 'Crustaceans, Shellfish';

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_bn" TEXT,
    "subtitle" TEXT,
    "subtitle_bn" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySection" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorySection_type_key" ON "StorySection"("type");
