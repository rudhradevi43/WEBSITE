import { PrismaClient, ExperienceLevel, JobType, WorkMode } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const countries = [
  ["United Kingdom", "GB", "GBP", "Skilled Worker visa"],
  ["Germany", "DE", "EUR", "EU Blue Card"],
  ["Netherlands", "NL", "EUR", "Highly Skilled Migrant"],
  ["Ireland", "IE", "EUR", "Critical Skills Employment Permit"],
  ["Sweden", "SE", "SEK", "Sweden Work Permit"],
  ["Denmark", "DK", "DKK", "Positive List Scheme"],
  ["Norway", "NO", "NOK", "Skilled Worker Residence Permit"],
  ["Finland", "FI", "EUR", "Specialist Permit"],
  ["Switzerland", "CH", "CHF", "B Permit"],
  ["Austria", "AT", "EUR", "Red-White-Red Card"],
  ["Belgium", "BE", "EUR", "Single Permit"],
  ["France", "FR", "EUR", "Talent Passport"],
  ["Canada", "CA", "CAD", "Global Talent Stream"],
  ["Australia", "AU", "AUD", "Temporary Skill Shortage visa"]
] as const;

const sponsors = [
  "Microsoft",
  "Accenture",
  "Capgemini",
  "SAP",
  "Booking.com",
  "ING",
  "ASML",
  "Amazon",
  "Deloitte",
  "KPMG",
  "EY",
  "PwC"
];

const skills = [
  "Power Apps",
  "Power Automate",
  "Power BI",
  "DAX",
  "Power Fx",
  "Dataverse",
  "SharePoint Online",
  "Python",
  "Pandas",
  "SQL",
  "ETL",
  "Microsoft 365",
  "Teams Integration",
  "Workflow Automation",
  "Azure Data Factory",
  "Docker"
];

const defaultTitles = [
  "Power Platform Developer",
  "Power BI Developer",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Python Automation Engineer",
  "ETL Developer",
  "Microsoft 365 Consultant"
];

async function main() {
  const skillRecords = await Promise.all(
    skills.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name, category: name.startsWith("Power") ? "Microsoft Power Platform" : "Data" }
      })
    )
  );

  await prisma.user.upsert({
    where: { email: "demo@visapath.ai" },
    update: {},
    create: {
      email: "demo@visapath.ai",
      name: "Demo Candidate",
      passwordHash: await bcrypt.hash("password123", 12),
      targetTitles: defaultTitles,
      targetSkills: skills.slice(0, 14),
      targetCountries: ["United Kingdom", "Germany", "Netherlands", "Ireland", "Canada", "Australia"]
    }
  });

  for (const [name, code, currency, visaName] of countries) {
    const country = await prisma.country.upsert({
      where: { code },
      update: { name, currency },
      create: { name, code, currency }
    });

    const visaProgram = await prisma.visaProgram.upsert({
      where: { countryId_name: { countryId: country.id, name: visaName } },
      update: {},
      create: {
        countryId: country.id,
        name: visaName,
        description: `${visaName} route for skilled technology professionals.`
      }
    });

    for (const sponsor of sponsors.slice(0, 4)) {
      await prisma.company.upsert({
        where: { name_countryId: { name: sponsor, countryId: country.id } },
        update: {},
        create: {
          name: sponsor,
          countryId: country.id,
          hiringFrequency: "Recurring",
          sponsorshipHistory: "Known to sponsor qualified technology professionals.",
          sponsorshipConfidenceScore: sponsor === "Microsoft" || sponsor === "Accenture" ? 92 : 84,
          techStack: ["Microsoft 365", "Power Platform", "Azure", "SQL"],
          visaPrograms: { connect: { id: visaProgram.id } }
        }
      });
    }
  }

  const uk = await prisma.country.findUniqueOrThrow({ where: { code: "GB" } });
  const ukVisa = await prisma.visaProgram.findFirstOrThrow({ where: { countryId: uk.id } });
  const microsoftUk = await prisma.company.findFirstOrThrow({ where: { name: "Microsoft", countryId: uk.id } });

  await prisma.job.upsert({
    where: { source_externalId: { source: "seed", externalId: "power-platform-developer-uk" } },
    update: {},
    create: {
      source: "seed",
      externalId: "power-platform-developer-uk",
      companyId: microsoftUk.id,
      countryId: uk.id,
      visaProgramId: ukVisa.id,
      title: "Power Platform Developer",
      city: "London",
      salaryMin: 65000,
      salaryMax: 85000,
      currency: "GBP",
      description: "Build enterprise Power Apps, Power Automate workflows, Dataverse models, and Power BI dashboards.",
      applyUrl: "https://careers.microsoft.com",
      sponsorshipAvailable: true,
      visaType: ukVisa.name,
      workMode: WorkMode.HYBRID,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.MID,
      matchScore: 94,
      postedAt: new Date(),
      skills: {
        connect: skillRecords
          .filter((skill) => ["Power Apps", "Power Automate", "Power BI", "DAX", "Dataverse", "SQL"].includes(skill.name))
          .map((skill) => ({ id: skill.id }))
      }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
