import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const students = [
  { id: "232-15-356", name: "Md Sakib hossain" },
  { id: "232-15-371", name: "Md Riyad Ahmed Mehedi" },
  { id: "232-15-379", name: "Mehjabin Khondokar Moon" },
  { id: "232-15-389", name: "Md Sharif Chowdhury" },
  { id: "232-15-345", name: "Mehedi Hasan Rokon" },
  { id: "242220005101067", name: "MD. Rakibul Hasan Rihan" },
  { id: "232-15-973", name: "Tabassum Tamim Tosmi" },
  { id: "232-15-261", name: "ShujaUddin Md Wasiq" },
  { id: "232-15-338", name: "Tasnim Rahman Nova" },
  { id: "232-15-312", name: "Susmit Majumder" },
  { id: "232-15-418", name: "Talha Ibn layek" },
  { id: "232-15-914", name: "Md. Junaidul Islam Jarif" },
  { id: "232-15-521", name: "Faysal Ahamed" },
  { id: "232-15-627", name: "Sumaya Jahan Trisha" },
  { id: "232-15-954", name: "Zannatul Marjan" },
  { id: "232-15-304", name: "Md. Hadiuzzaman" },
  { id: "232-15-297", name: "Habibur Rahman" },
  { id: "232-15-166", name: "Ahsanul Islam Faisal" },
  { id: "232-15-156", name: "Md Noyon Hossain" },
  { id: "232-15-121", name: "Shemanto Saha" },
  { id: "232-15-191", name: "Md. Yasin Rifat" },
  { id: "232-15-010", name: "MD Ragib Shariar" },
  { id: "232-15-777", name: "Md Nazmus Sakib" },
  { id: "232-15-165", name: "MD.Jubaer Al-fi Sanny" }
];

async function main() {
  const hashedPassword = await bcrypt.hash("diu", 10);
  
  for (const s of students) {
    try {
      await prisma.participant.upsert({
        where: { student_id: s.id },
        update: { name: s.name },
        create: {
          student_id: s.id,
          name: s.name,
          password: hashedPassword
        }
      });
      console.log("Registered:", s.name);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.log("Error:", s.name, err.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());