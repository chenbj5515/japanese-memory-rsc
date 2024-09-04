/*
  Warnings:

  - You are about to drop the `MemoCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MemoCard";

-- CreateTable
CREATE TABLE "memo_card" (
    "id" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,
    "record_file_path" TEXT,
    "original_text" TEXT,
    "review_times" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL DEFAULT 'chenbj',
    "kana_pronunciation" TEXT,

    CONSTRAINT "memo_card_pkey" PRIMARY KEY ("id")
);
