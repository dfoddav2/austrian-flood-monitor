-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "downvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_UpvotedReports" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DownvotedReports" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UpvotedReports_AB_unique" ON "_UpvotedReports"("A", "B");

-- CreateIndex
CREATE INDEX "_UpvotedReports_B_index" ON "_UpvotedReports"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DownvotedReports_AB_unique" ON "_DownvotedReports"("A", "B");

-- CreateIndex
CREATE INDEX "_DownvotedReports_B_index" ON "_DownvotedReports"("B");

-- AddForeignKey
ALTER TABLE "_UpvotedReports" ADD CONSTRAINT "_UpvotedReports_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvotedReports" ADD CONSTRAINT "_UpvotedReports_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownvotedReports" ADD CONSTRAINT "_DownvotedReports_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownvotedReports" ADD CONSTRAINT "_DownvotedReports_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
