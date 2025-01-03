import { PrismaClient } from "@prisma/client";
// import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create users
    const users = await prisma.user.createMany({
      data: [
        {
          id: "admin_id_1",
          email: "admin@example.com",
          name: "Admin User",
          username: "adminuser",
          password: "password123", // Ensure to hash passwords in a real application
          userRole: "ADMIN",
          verified: true,
        },
        {
          id: "responder_id_1",
          email: "responder@example.com",
          name: "Responder User",
          username: "responderuser",
          password: "password123", // Ensure to hash passwords in a real application
          userRole: "RESPONDER",
          verified: true,
        },
        {
          id: "user_id_1",
          email: "user@example.com",
          name: "Regular User",
          username: "regularuser",
          password: "password123", // Ensure to hash passwords in a real application
          userRole: "USER",
        },
      ],
    });

    console.log("Users seeded successfully 🌱");

    const reports = await prisma.report.createMany({
      data: [
        {
          id: "report_id_1",
          title: "Flood in Vienna",
          description: "Severe flooding in the city center.",
          latitude: 48.2082,
          longitude: 16.3738,
          authorId: "user_id_1",
          upvotes: 1,
        },
        {
          id: "report_id_2",
          title: "Landslide in Salzburg",
          description: "Landslide blocking the main road.",
          latitude: 47.8095,
          longitude: 13.055,
          authorId: "user_id_1",
        },
        {
          id: "report_id_3",
          title: "Heavy Rain in Graz",
          description: "Continuous heavy rain causing waterlogging.",
          latitude: 47.0707,
          longitude: 15.4395,
          authorId: "responder_id_1",
        },
        {
          id: "report_id_4",
          title: "River Krems Flooding",
          description:
            "In the previous 24 hours, the river has risen by 2 meters. The water level is still rising. Residents are advised to evacuate.",
          latitude: 48.410497,
          longitude: 15.616334,
          authorId: "admin_id_1",
        },
      ],
    });

    console.log("Reports seeded successfully 🌱");

    // Connect user upvotes
    await prisma.report.update({
      where: { id: "report_id_1" },
      data: {
        upvotedBy: {
          connect: { id: "responder_id_1" },
        },
      },
    });

    console.log("User upvotes connected successfully 🌱");

    // Create images
    const images = await prisma.image.createMany({
      data: [
        {
          id: "image_id_1",
          reportId: "report_id_1",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/ywlhvyxiejmu4djfkcgz.webp",
          description: "Flooded street in Vienna",
        },
        {
          id: "image_id_2",
          reportId: "report_id_1",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/oaf5y2e0mcvcvldg95g9.avif",
          description: "Flooded street in Vienna 2",
        },
        {
          id: "image_id_3",
          reportId: "report_id_2",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/b7hfhkj4mwz6jdihfxvw.jpg",
          description: "Waterlogged area in Graz",
        },
        {
          id: "image_id_4",
          reportId: "report_id_4",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733387374/dnnulqdjunu875wczhlm.jpg",
          description: "River Krems flooding",
        },
      ],
    });

    console.log("Images seeded successfully 🌱");

    // Create comments
    const comments = await prisma.comment.createMany({
      data: [
        {
          id: "comment_id_1",
          reportId: "report_id_1",
          userId: "user_id_1",
          content: "This is a serious situation. Stay safe everyone!",
        },
        {
          id: "comment_id_2",
          reportId: "report_id_1",
          userId: "responder_id_1",
          content: "I'm on my way to the location.",
        },
        {
          id: "comment_id_3",
          reportId: "report_id_2",
          userId: "admin_id_1",
          content: "I've alerted the local authorities.",
        },
        {
          id: "comment_id_4",
          reportId: "report_id_4",
          userId: "user_id_1",
          content: "I've shared this report with my friends.",
        },
      ],
    });

    console.log("Comments seeded successfully 🌱");

  } catch (error) {
    console.error("Error seeding data: ", error);
  } finally {
    await prisma.$disconnect();
  }

  process.exit(0);
}

main();
