import { PrismaClient } from "@prisma/client";
// import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();

try {
  await prisma.user.create({
    data: {
      id: "example_id_1234",
      name: "John Doe",
    },
  });
  console.log("Data seeded successfully 🌱");
} catch (error) {
  console.error("Error seeding data:", error);
} finally {
  await prisma.$disconnect();
}

process.exit(0);
