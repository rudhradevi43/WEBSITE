import { PrismaClient, RemoteType } from "@prisma/client";
import { hash } from "bcryptjs";
import { DEFAULT_SKILLS, SUPPORTED_COUNTRIES } from "@visapath/shared";

const prisma = new PrismaClient();

const countryMeta: Record<string, { isoCode: string; currency: string; visa: string }> = {
  "United Kingdom": { isoCode: "GB", currency: "GBP", visa: "Skilled Worker Visa" },
  Germany: { isoCode: "DE", currency: "EUR", visa: "EU Blue Card" },
  Netherlands: { isoCode: "NL", currency: "EUR", visa: "Highly Skilled Migrant Permit" },
  Ireland: { isoCode: "IE", currency: "EUR", visa: "Critical Skills Employment Permit" },
  Sweden: { isoCode: "SE", currency: "SEK", visa: "Swedish Work Permit" },
  Denmark: { isoCode: "DK", currency: "DKK", visa: "Positive List Work Permit" },
  Norway: { isoCode: "NO", currency: "NOK", visa: "Skilled Worker Residence Permit" },
  Finland: { isoCode: "FI", currency: "EUR", visa: "Specialist Residence Permit" },
  Switzerland: { isoCode: "CH", currency: "CHF", visa: "Swiss Work Permit" },
  Austria: { isoCode: "AT", currency: "EUR", visa: "Red-White-Red Card" },
  Belgium: { isoCode: "BE", currency: "EUR", visa: "Single Permit" },
  France: { isoCode: "FR", currency: "EUR", visa: "Talent Passport" },
  Canada: { isoCode: "CA", currency: "CAD", visa: "Global Talent Stream" },
  Australia: { isoCode: "AU", currency: "AUD", visa: "Temporary Skill Shortage Visa" }
};

const sponsorCompanies = [
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

async function main() {
  const skills = await Promise.all(
    DEFAULT_SKILLS.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  const countryRecords = new Map<string, Awaited<ReturnType<typeof prisma.country.upsert>>>();
  const visaRecords = new Map<string, Awaited<ReturnType<typeof prisma.visaProgram.upsert>>>();

  for (const country of SUPPORTED_COUNTRIES) {
    const meta = countryMeta[country];
    const countryRecord = await prisma.country.upsert({
      where: { name: country },
      update: { isoCode: meta.isoCode, currency: meta.currency },
      create: { name: country, isoCode: meta.isoCode, currency: meta.currency }
    });

    const visaProgram = await prisma.visaProgram.upsert({
      where: { countryId_name: { countryId: countryRecord.id, name: meta.visa } },
      update: {
        description: `${meta.visa} pathway for qualified technology professionals with eligible sponsor employers.`,
        officialUrl: "https://visapath.ai/resources"
      },
      create: {
        countryId: countryRecord.id,
        name: meta.visa,
        description: `${meta.visa} pathway for qualified technology professionals with eligible sponsor employers.`,
        officialUrl: "https://visapath.ai/resources"
      }
    });

    countryRecords.set(country, countryRecord);
    visaRecords.set(country, visaProgram);
  }

  const uk = countryRecords.get("United Kingdom")!;
  const nl = countryRecords.get("Netherlands")!;
  const ca = countryRecords.get("Canada")!;

  for (const [index, companyName] of sponsorCompanies.entries()) {
    const country = index % 3 === 0 ? uk : index % 3 === 1 ? nl : ca;
    const company = await prisma.company.upsert({
      where: { name_countryId: { name: companyName, countryId: country.id } },
      update: {
        sponsorshipConfidenceScore: 72 + (index % 5) * 5,
        techStack: ["Microsoft 365", "Power BI", "Azure", "SQL", "Python"]
      },
      create: {
        name: companyName,
        countryId: country.id,
        website: `https://careers.${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        hiringFrequency: index % 2 === 0 ? "High" : "Medium",
        sponsorshipHistory: "Known to hire international technology candidates for eligible roles.",
        sponsorshipConfidenceScore: 72 + (index % 5) * 5,
        techStack: ["Microsoft 365", "Power BI", "Azure", "SQL", "Python"],
        visaPrograms: {
          connect: [{ id: visaRecords.get(country.name)!.id }]
        }
      }
    });

    await prisma.job.upsert({
      where: { source_externalId: { source: "Seed", externalId: `${companyName}-power-platform` } },
      update: {},
      create: {
        companyId: company.id,
        countryId: country.id,
        visaProgramId: visaRecords.get(country.name)!.id,
        source: "Seed",
        externalId: `${companyName}-power-platform`,
        roleTitle: index % 2 === 0 ? "Power Platform Developer" : "Business Intelligence Analyst",
        city: country.name === "United Kingdom" ? "London" : country.name === "Netherlands" ? "Amsterdam" : "Toronto",
        description:
          "Build Power Apps, Power Automate flows, Power BI dashboards, Dataverse integrations, SQL data models, and Python automation for enterprise teams.",
        salaryMin: country.currency === "GBP" ? 55000 : 70000,
        salaryMax: country.currency === "GBP" ? 85000 : 105000,
        currency: country.currency,
        sponsorshipAvailable: true,
        visaType: visaRecords.get(country.name)!.name,
        remoteType: index % 2 === 0 ? RemoteType.HYBRID : RemoteType.REMOTE,
        applyLink: `https://careers.example.com/${companyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        datePosted: new Date(Date.now() - index * 86_400_000),
        skills: {
          connect: skills.slice(0, 8 + (index % 4)).map((skill) => ({ id: skill.id }))
        }
      }
    });
  }

  const passwordHash = await hash(`DemoPass123!${process.env.PASSWORD_PEPPER ?? ""}`, 12);
  await prisma.user.upsert({
    where: { email: "demo@visapath.ai" },
    update: {},
    create: {
      email: "demo@visapath.ai",
      name: "Demo Candidate",
      passwordHash,
      countryTarget: "United Kingdom"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
