-- CreateTable
CREATE TABLE "MemoCard" (
    "id" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,
    "record_file_path" TEXT,
    "original_text" TEXT,
    "review_times" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL DEFAULT 'chenbj',
    "kana_pronunciation" TEXT,

    CONSTRAINT "MemoCard_pkey" PRIMARY KEY ("id")
);
