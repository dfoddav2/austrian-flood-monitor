import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();
// Hashing
const saltRounds = 10;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function main() {
  try {
    // Hash password 123
    const hashedPassword = await hashPassword("password123");

    // Create users
    const users = await prisma.user.createMany({
      data: [
        {
          id: "admin_id_1",
          email: "admin@example.com",
          name: "Admin User",
          username: "adminuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "ADMIN",
        },
        {
          id: "responder_id_1",
          email: "responder@example.com",
          name: "Responder User",
          username: "responderuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "RESPONDER",
        },
        {
          id: "responder_id_2",
          email: "responder2@example.com",
          name: "Second Responder",
          username: "secondresponder",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "RESPONDER",
        },
        {
          id: "responder_id_3",
          email: "responder3@example.com",
          name: "Third Responder",
          username: "thirdresponder",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "RESPONDER",
        },
        {
          id: "user_id_1",
          email: "user@example.com",
          name: "Regular User",
          username: "regularuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "USER",
        },
        {
          id: "user_id_2",
          email: "user2@example.com",
          name: "Second User",
          username: "seconduser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "USER",
        },
        {
          id: "user_id_3",
          email: "user3@example.com",
          name: "Third User",
          username: "thirduser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "USER",
        },
        {
          id: "user_id_4",
          email: "user4@example.com",
          name: "Fourth User",
          username: "fourthuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "USER",
        },
        {
          id: "user_id_5",
          email: "user5@example.com",
          name: "Fifth User",
          username: "fifthuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "USER",
        },
        {
          id: "user_id_6",
          email: "user6@example.com",
          name: "Sixth User",
          username: "sixthuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
          userRole: "USER",
        },
        {
          id: "user_id_7",
          email: "user7@example.com",
          name: "Seventh User",
          username: "seventhuser",
          password: hashedPassword, // Ensure to hash passwords in a real application
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
        {
          id: "report_id_5",
          title: "Flash Flood in Linz",
          description: "Sudden flash flood in the city center, several streets are impassable.",
          latitude: 48.3069,
          longitude: 14.2898,
          authorId: "user_id_4",
        },
        {
          id: "report_id_6",
          title: "Localized Flooding in Salzburg",
          description: "Heavy rainfall has caused localized flooding in the south of the city.",
          latitude: 47.8095,
          longitude: 13.055,
          authorId: "user_id_5",
        },
        {
          id: "report_id_7",
          title: "Rising Danube Levels in Vienna",
          description: "The Danube River is experiencing high water levels, causing minor flooding along the riverbanks.",
          latitude: 48.2082,
          longitude: 16.3738,
          authorId: "user_id_6",
        },
        {
          id: "report_id_8",
          title: "Flooded Basement in Innsbruck",
          description: "Heavy rain has caused several basements to flood in the Innsbruck area.",
          latitude: 47.2672,
          longitude: 11.4126,
          authorId: "responder_id_3",
        },
        {
          id: "report_id_9",
          title: "Road Closure due to Flooding in Graz",
          description: "A major road in Graz is currently closed due to severe flooding.",
          latitude: 47.0707,
          longitude: 15.4395,
          authorId: "user_id_7",
        },
        {
          id: "report_id_10",
          title: "Mudslide in the Alps",
          description: "Heavy rainfall has triggered a mudslide in the Austrian Alps, blocking a mountain pass.",
          latitude: 47.14, 
          longitude: 10.67, // Approximate coordinates for the Alps
          authorId: "admin_id_1",
        },
        {
          id: "report_id_11",
          title: "River Overflow in Linz",
          description: "A local river in Linz has overflowed its banks, flooding nearby fields and threatening some homes.",
          latitude: 48.3069,
          longitude: 14.2898,
          authorId: "user_id_2",
        },
        {
          id: "report_id_12",
          title: "Localized Flooding in Vienna",
          description: "Heavy rainfall has caused localized flooding in some parts of Vienna.",
          latitude: 48.2082, 
          longitude: 16.3738, 
          authorId: "responder_id_1",
        },
        {
          id: "report_id_13",
          title: "Basement Flooding in Salzburg",
          description: "Several basements have flooded in Salzburg due to heavy rain.",
          latitude: 47.8095,
          longitude: 13.055,
          authorId: "user_id_3",
        },
        {
          id: "report_id_14",
          title: "River Level Rising in Krems",
          description: "The water level in the River Krems is continuing to rise.",
          latitude: 48.410497,
          longitude: 15.616334,
          authorId: "responder_id_2",
        },
        {
          id: "report_id_15",
          title: "Flooded Park in Vienna",
          description: "A popular park in Vienna is currently flooded due to heavy rainfall.",
          latitude: 48.2082,
          longitude: 16.3738,
          authorId: "user_id_1", 
        },
        {
          id: "report_id_16",
          title: "Rising Water Levels in Lake Constance",
          description: "High water levels are being reported in Lake Constance, affecting nearby towns.",
          latitude: 47.5, 
          longitude: 9.5, // Approximate coordinates for Lake Constance
          authorId: "admin_id_1",
        },
        {
          id: "report_id_17",
          title: "Flooded Road in Graz",
          description: "A major road in Graz is currently flooded, making it impassable.",
          latitude: 47.0707,
          longitude: 15.4395,
          authorId: "user_id_2",
        },
        {
          id: "report_id_18",
          title: "Heavy Rain in Innsbruck",
          description: "Heavy rain is currently falling in Innsbruck, with potential for localized flooding.",
          latitude: 47.2672,
          longitude: 11.4126,
          authorId: "responder_id_3",
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
        {
          id: "image_id_5",
          reportId: "report_id_5",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/ywlhvyxiejmu4djfkcgz.webp",
          description: "Flash flood in Linz",
        },
        {
          id: "image_id_6",
          reportId: "report_id_6",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/oaf5y2e0mcvcvldg95g9.avif",
          description: "Localized Flooding in Salzburg",
        },
        {
          id: "image_id_7",
          reportId: "report_id_7",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/b7hfhkj4mwz6jdihfxvw.jpg",
          description: "Rising Danube levels in Vienna",
        },
        {
          id: "image_id_9",
          reportId: "report_id_9",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733387374/dnnulqdjunu875wczhlm.jpg",
          description: "Road closure due to flooding in Graz",
        },
        {
          id: "image_id_10",
          reportId: "report_id_10",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/ywlhvyxiejmu4djfkcgz.webp",
          description: "Mudslide in Alps",
        },
        {
          id: "image_id_11",
          reportId: "report_id_11",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/oaf5y2e0mcvcvldg95g9.avif",
          description: "River overflow in Linz",
        },
        {
          id: "image_id_12",
          reportId: "report_id_12",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/b7hfhkj4mwz6jdihfxvw.jpg",
          description: "Localized flooding in Vienna ",
        },
        {
          id: "image_id_14",
          reportId: "report_id_14",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733387374/dnnulqdjunu875wczhlm.jpg",
          description: "River Level rising in Krems",
        },
        {
          id: "image_id_15",
          reportId: "report_id_15",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/ywlhvyxiejmu4djfkcgz.webp",
          description: "Flooded park in Vienna",
        },
        {
          id: "image_id_16",
          reportId: "report_id_16",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/oaf5y2e0mcvcvldg95g9.avif",
          description: "Rising water lake Constance",
        },
        {
          id: "image_id_17",
          reportId: "report_id_17",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733392478/b7hfhkj4mwz6jdihfxvw.jpg",
          description: "Flooded road in Graz",
        },
        {
          id: "image_id_18",
          reportId: "report_id_18",
          source:
            "https://res.cloudinary.com/imc-austrian-flood-monitor/image/upload/q_auto/f_auto/v1733387374/dnnulqdjunu875wczhlm.jpg",
          description: "Heavy rain in Innsbruck",
        },
      ],
    });

    console.log("Images seeded successfully 🌱");
  } catch (error) {
    console.error("Error seeding data: ", error);
  } finally {
    await prisma.$disconnect();
  }

  process.exit(0);
}

main();
