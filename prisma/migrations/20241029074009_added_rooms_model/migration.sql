-- CreateTable
CREATE TABLE "userRooms" (
    "id" TEXT NOT NULL,
    "receiverEndUserName" TEXT NOT NULL,

    CONSTRAINT "userRooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userRooms" ADD CONSTRAINT "userRooms_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
