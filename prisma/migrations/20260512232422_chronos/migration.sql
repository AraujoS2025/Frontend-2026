-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `workTime` INTEGER NOT NULL DEFAULT 25,
    `shortBreakTime` INTEGER NOT NULL DEFAULT 5,
    `longBreakTime` INTEGER NOT NULL DEFAULT 15,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `startDate` INTEGER NOT NULL,
    `completeDate` INTEGER NULL,
    `interruptDate` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
