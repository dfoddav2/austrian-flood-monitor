import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
// import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();
// Hashing
const saltRounds = 10;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  try {
    // Hash password 123
    const hashedPassword = await hashPassword("password123");
    const startDate = new Date("2024-11-01T00:00:00Z");
    const endDate = new Date("2025-01-09T23:59:59Z");

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
          verified: true,
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
          verified: true,
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
        {
          id: "user_id_8",
          email: "user8@example.com",
          name: "Anna Schmidt",
          username: "anna_schmidt",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_9",
          email: "user9@example.com",
          name: "Bernhard Müller",
          username: "bernhard_muller",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_10",
          email: "clara_huber@example.com",
          name: "Clara Huber",
          username: "clara_huber",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_11",
          email: "david_schulz@example.com",
          name: "David Schulz",
          username: "david_schulz",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_12",
          email: "elena_wolf@example.com",
          name: "Elena Wolf",
          username: "elena_wolf",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_13",
          email: "franz_huber@example.com",
          name: "Franz Huber",
          username: "franz_huber",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_14",
          email: "greta_meyer@example.com",
          name: "Greta Meyer",
          username: "greta_meyer",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_15",
          email: "hans_schmidt@example.com",
          name: "Hans Schmidt",
          username: "hans_schmidt",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_16",
          email: "ida_wagner@example.com",
          name: "Ida Wagner",
          username: "ida_wagner",
          password: hashedPassword,
          userRole: "USER",
        },
        {
          id: "user_id_17",
          email: "jakob_huber@example.com",
          name: "Jakob Huber",
          username: "jakob_huber",
          password: hashedPassword,
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
          latitude: 48.2092,
          longitude: 16.3748,
          authorId: "user_id_1",
          upvotes: 1,
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_2",
          title: "Waterlogged area in Graz",
          description:
            "Continuous heavy rain causing waterlogging in the inner parts of Graz.",
          latitude: 47.07,
          longitude: 15.441,
          authorId: "responder_id_1",
          createdAt: new Date("2024-12-24T12:00:00Z"),
        },
        {
          id: "report_id_3",
          title: "Heavy Rain in Graz",
          description: "Continuous heavy rain causing waterlogging.",
          latitude: 47.0727,
          longitude: 15.4385,
          authorId: "responder_id_1",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_4",
          title: "River Krems Flooding",
          description:
            "In the previous 24 hours, the river has risen by 2 meters. The water level is still rising. Residents are advised to evacuate.",
          latitude: 48.411497,
          longitude: 15.618334,
          authorId: "admin_id_1",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_5",
          title: "Flash Flood in Linz",
          description:
            "Sudden flash flood in the city center, several streets are impassable.",
          latitude: 48.3089,
          longitude: 14.2908,
          authorId: "user_id_4",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_6",
          title: "Localized Flooding in Salzburg",
          description:
            "Heavy rainfall has caused localized flooding in the south of the city.",
          latitude: 47.8085,
          longitude: 13.053,
          authorId: "user_id_5",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_7",
          title: "Rising Danube Levels in Vienna",
          description:
            "The Danube River is experiencing high water levels, causing minor flooding along the riverbanks.",
          latitude: 48.2102,
          longitude: 16.3748,
          authorId: "user_id_6",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_8",
          title: "Flooded Basement in Innsbruck",
          description:
            "Heavy rain has caused several basements to flood in the Innsbruck area.",
          latitude: 47.2682,
          longitude: 11.4106,
          authorId: "responder_id_3",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_9",
          title: "Road Closure due to Flooding in Graz",
          description:
            "A major road in Graz is currently closed due to severe flooding.",
          latitude: 47.0717,
          longitude: 15.4405,
          authorId: "user_id_7",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_10",
          title: "Mudslide in the Alps",
          description:
            "Heavy rainfall has triggered a mudslide in the Austrian Alps, blocking a mountain pass.",
          latitude: 47.15,
          longitude: 10.68,
          authorId: "admin_id_1",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_11",
          title: "River Overflow in Linz",
          description:
            "A local river in Linz has overflowed its banks, flooding nearby fields and threatening some homes.",
          latitude: 48.3059,
          longitude: 14.2888,
          authorId: "user_id_2",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_12",
          title: "Localized Flooding in Vienna",
          description:
            "Heavy rainfall has caused localized flooding in some parts of Vienna.",
          latitude: 48.209,
          longitude: 16.375,
          authorId: "responder_id_1",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_13",
          title: "Basement Flooding in Salzburg",
          description:
            "Several basements have flooded in Salzburg due to heavy rain.",
          latitude: 47.811,
          longitude: 13.056,
          authorId: "user_id_3",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_14",
          title: "River Level Rising in Krems",
          description:
            "The water level in the River Krems is continuing to rise.",
          latitude: 48.4106,
          longitude: 15.617,
          authorId: "responder_id_2",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_15",
          title: "Flooded Park in Vienna",
          description:
            "A popular park in Vienna is currently flooded due to heavy rainfall.",
          latitude: 48.2092,
          longitude: 16.3758,
          authorId: "user_id_1",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_16",
          title: "Rising Water Levels in Lake Constance",
          description:
            "High water levels are being reported in Lake Constance, affecting nearby towns.",
          latitude: 47.5,
          longitude: 9.5,
          authorId: "admin_id_1",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_17",
          title: "Flooded Road in Graz",
          description:
            "A major road in Graz is currently flooded, making it impassable.",
          latitude: 47.0705,
          longitude: 15.4396,
          authorId: "user_id_2",
          createdAt: getRandomDate(startDate, endDate),
        },
        {
          id: "report_id_18",
          title: "Heavy Rain in Innsbruck",
          description:
            "Heavy rain is currently falling in Innsbruck, with potential for localized flooding.",
          latitude: 47.2673,
          longitude: 11.4127,
          authorId: "responder_id_3",
          createdAt: getRandomDate(startDate, endDate),
        },
      ],
    });

    console.log("Reports seeded successfully 🌱");

    // Connect user upvotes
    const upvotes = [
      { reportId: "report_id_1", userId: "user_id_2" },
      { reportId: "report_id_1", userId: "user_id_3" },
      { reportId: "report_id_3", userId: "user_id_4" },
      { reportId: "report_id_3", userId: "user_id_5" },
      { reportId: "report_id_5", userId: "user_id_6" },
      { reportId: "report_id_5", userId: "user_id_7" },
      { reportId: "report_id_7", userId: "user_id_8" },
      { reportId: "report_id_7", userId: "user_id_9" },
      { reportId: "report_id_9", userId: "user_id_9" },
      { reportId: "report_id_9", userId: "user_id_10" },
      { reportId: "report_id_11", userId: "user_id_11" },
      { reportId: "report_id_11", userId: "user_id_12" },
      { reportId: "report_id_12", userId: "responder_id_2" },
      { reportId: "report_id_12", userId: "responder_id_3" },
      { reportId: "report_id_14", userId: "user_id_13" },
      { reportId: "report_id_14", userId: "user_id_14" },
      { reportId: "report_id_15", userId: "user_id_14" },
      { reportId: "report_id_15", userId: "user_id_15" },
      { reportId: "report_id_16", userId: "user_id_15" },
      { reportId: "report_id_16", userId: "user_id_16" },
      { reportId: "report_id_17", userId: "user_id_16" },
      { reportId: "report_id_17", userId: "user_id_17" },
      { reportId: "report_id_18", userId: "user_id_17" },
      { reportId: "report_id_1", userId: "admin_id_1" },
    ];

    for (const upvote of upvotes) {
      try {
        // await prisma.report.update({
        //   where: { id: "report_id_1" },
        //   data: {
        //     upvotedBy: {
        //       connect: { id: "responder_id_1" },
        //     },
        //   },
        // });

        await prisma.report.update({
          where: { id: upvote.reportId },
          data: {
            upvotedBy: {
              connect: { id: upvote.userId },
            },
            upvotes: {
              increment: 1,
            },
          },
        });
      } catch (error) {
        console.error(
          `Failed to connect user ${upvote.userId} to report ${upvote.reportId}:`,
          error
        );
      }
    }

    console.log("User upvotes connected successfully 🌱");

    const downvotes = [
      { reportId: "report_id_2", userId: "user_id_1" },
      { reportId: "report_id_5", userId: "user_id_2" },
      { reportId: "report_id_8", userId: "user_id_3" },
      { reportId: "report_id_11", userId: "user_id_4" },
      { reportId: "report_id_14", userId: "user_id_5" },
      { reportId: "report_id_17", userId: "user_id_6" },
      { reportId: "report_id_1", userId: "user_id_9" },
      { reportId: "report_id_3", userId: "user_id_11" },
      { reportId: "report_id_5", userId: "user_id_13" },
      { reportId: "report_id_7", userId: "user_id_15" },
      { reportId: "report_id_9", userId: "user_id_17" },
      { reportId: "report_id_1", userId: "user_id_10" },
      { reportId: "report_id_2", userId: "user_id_12" },
      { reportId: "report_id_4", userId: "user_id_14" },
      { reportId: "report_id_6", userId: "user_id_16" },
    ];

    for (const downvote of downvotes) {
      try {
        await prisma.report.update({
          where: { id: downvote.reportId },
          data: {
            downvotedBy: {
              connect: { id: downvote.userId },
            },
            downvotes: {
              increment: 1,
            },
          },
        });
      } catch (error) {
        console.error(
          `Failed to connect user ${downvote.userId} to report ${downvote.reportId}:`,
          error
        );
      }
    }

    console.log("User downvotes connected successfully 🌱");

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
        {
          id: "comment_id_5",
          reportId: "report_id_1",
          userId: "user_id_2",
          content: "Please be careful!",
        },
        {
          id: "comment_id_6",
          reportId: "report_id_3",
          userId: "user_id_3",
          content: "I hope everyone is safe.",
        },
        {
          id: "comment_id_7",
          reportId: "report_id_5",
          userId: "user_id_4",
          content: "Please stay indoors if possible.",
        },
        {
          id: "comment_id_8",
          reportId: "report_id_7",
          userId: "user_id_5",
          content: "I'm worried about the rising water levels.",
        },
        {
          id: "comment_id_9",
          reportId: "report_id_9",
          userId: "user_id_6",
          content: "Be cautious on the roads.",
        },
        {
          id: "comment_id_10",
          reportId: "report_id_11",
          userId: "user_id_7",
          content: "I hope the flooding subsides soon.",
        },
        {
          id: "comment_id_11",
          reportId: "report_id_1",
          userId: "user_id_8",
          content: "Is anyone else experiencing power outages?",
        },
        {
          id: "comment_id_12",
          reportId: "report_id_2",
          userId: "user_id_9",
          content: "Has anyone seen the authorities yet?",
        },
        {
          id: "comment_id_13",
          reportId: "report_id_3",
          userId: "user_id_10",
          content: "I'm hoping for the best for everyone.",
        },
        {
          id: "comment_id_14",
          reportId: "report_id_4",
          userId: "user_id_11",
          content: "Stay safe and stay informed!",
        },
        {
          id: "comment_id_15",
          reportId: "report_id_5",
          userId: "user_id_12",
          content: "I'm concerned about the safety of the residents.",
        },
        {
          id: "comment_id_16",
          reportId: "report_id_6",
          userId: "user_id_13",
          content: "I hope the situation improves quickly.",
        },
        {
          id: "comment_id_17",
          reportId: "report_id_7",
          userId: "user_id_14",
          content: "Has anyone seen any emergency vehicles?",
        },
        {
          id: "comment_id_18",
          reportId: "report_id_8",
          userId: "user_id_15",
          content: "I hope everyone stays safe and dry.",
        },
        {
          id: "comment_id_19",
          reportId: "report_id_9",
          userId: "user_id_16",
          content: "Be extra cautious on the roads.",
        },
        {
          id: "comment_id_20",
          reportId: "report_id_10",
          userId: "user_id_17",
          content: "I hope the mudslide doesn't cause any major damage.",
        },
        {
          id: "comment_id_21",
          reportId: "report_id_1",
          userId: "responder_id_1",
          content: "I'm assessing the situation now.",
        },
        {
          id: "comment_id_22",
          reportId: "report_id_2",
          userId: "admin_id_1",
          content: "Emergency services are on their way.",
        },
        {
          id: "comment_id_23",
          reportId: "report_id_3",
          userId: "user_id_1",
          content: "Is anyone in need of assistance?",
        },
        {
          id: "comment_id_24",
          reportId: "report_id_4",
          userId: "user_id_2",
          content: "I'm staying indoors as advised.",
        },
        {
          id: "comment_id_25",
          reportId: "report_id_5",
          userId: "user_id_3",
          content: "I'm hoping the floodwaters recede quickly.",
        },
        {
          id: "comment_id_26",
          reportId: "report_id_6",
          userId: "user_id_4",
          content: "I'm staying away from the affected areas.",
        },
        {
          id: "comment_id_27",
          reportId: "report_id_7",
          userId: "user_id_5",
          content: "Has anyone heard from their loved ones?",
        },
        {
          id: "comment_id_28",
          reportId: "report_id_8",
          userId: "user_id_6",
          content: "I hope the situation improves soon.",
        },
        {
          id: "comment_id_29",
          reportId: "report_id_9",
          userId: "user_id_7",
          content: "Be careful and stay safe everyone!",
        },
        {
          id: "comment_id_30",
          reportId: "report_id_10",
          userId: "user_id_8",
          content: "I hope everyone is safe.",
        },
      ],
    });

    console.log("Comments seeded successfully 🌱");

    const filePath = path.join(__dirname, "monatsminima.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const [stationId, stationData] of Object.entries(data)) {
      const measurementStation = await prisma.minimaMeasurements.create({
        data: {
          id: stationId,
          stationName: stationData.name,
          waterBody: stationData.waterBody,
          catchmentArea: stationData.catchmentArea,
          operatingAuthority: stationData.operatingAuthority,
          measurements: stationData.measurements,
        },
      });
      // console.log(`Inserted station: ${measurementStation.stationName}`);
    }

    console.log("Measurements seeded successfully 🌱");
  } catch (error) {
    console.error("Error seeding data: ", error);
  } finally {
    await prisma.$disconnect();
  }

  process.exit(0);
}

main();
