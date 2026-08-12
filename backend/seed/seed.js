require("dotenv").config();

const driver = require("../src/config/db");

const seedDatabase = async () => {
  const session = driver.session();

  try {
    console.log("🌱 Starting database seed...");

    // --------------------------------------------------
    // 1. Candidates
    // --------------------------------------------------

    await session.run(`
      MERGE (c:Candidate {
        id: "candidate_001"
      })
      SET
        c.name = "Chandan Kumar",
        c.email = "chandan@example.com",
        c.experience = 3,
        c.location = "Delhi"
    `);

    await session.run(`
      MERGE (c:Candidate {
        id: "candidate_002"
      })
      SET
        c.name = "Rahul Sharma",
        c.email = "rahul@example.com",
        c.experience = 5,
        c.location = "Bangalore"
    `);

    await session.run(`
      MERGE (c:Candidate {
        id: "candidate_003"
      })
      SET
        c.name = "Priya Singh",
        c.email = "priya@example.com",
        c.experience = 2,
        c.location = "Mumbai"
    `);

    // --------------------------------------------------
    // 2. Skills
    // --------------------------------------------------

    const skills = [
      ["skill_001", "JavaScript", "Programming"],
      ["skill_002", "React", "Frontend"],
      ["skill_003", "Next.js", "Frontend"],
      ["skill_004", "Node.js", "Backend"],
      ["skill_005", "Express.js", "Backend"],
      ["skill_006", "TypeScript", "Programming"],
      ["skill_007", "MongoDB", "Database"],
      ["skill_008", "PostgreSQL", "Database"],
      ["skill_009", "AWS", "Cloud"],
      ["skill_010", "Docker", "DevOps"],
    ];

    for (const [id, name, category] of skills) {
      await session.run(
        `
        MERGE (s:Skill {id: $id})
        SET
          s.name = $name,
          s.category = $category
        `,
        {
          id,
          name,
          category,
        },
      );
    }

    // --------------------------------------------------
    // 3. Companies
    // --------------------------------------------------

    const companies = [
      {
        id: "company_001",
        name: "TechNova",
        location: "Delhi",
        industry: "Software",
      },
      {
        id: "company_002",
        name: "CloudMatrix",
        location: "Bangalore",
        industry: "Cloud Technology",
      },
      {
        id: "company_003",
        name: "FinEdge",
        location: "Mumbai",
        industry: "FinTech",
      },
    ];

    for (const company of companies) {
      await session.run(
        `
        MERGE (c:Company {id: $id})
        SET
          c.name = $name,
          c.location = $location,
          c.industry = $industry
        `,
        company,
      );
    }

    // --------------------------------------------------
    // 4. Jobs
    // --------------------------------------------------

    const jobs = [
      {
        id: "job_001",
        title: "Full Stack Developer",
        description: "Build scalable web applications.",
        experienceRequired: 2,
        location: "Delhi",
        employmentType: "Full-time",
        salary: 900000,
      },
      {
        id: "job_002",
        title: "Frontend Developer",
        description: "Build modern React applications.",
        experienceRequired: 2,
        location: "Bangalore",
        employmentType: "Full-time",
        salary: 800000,
      },
      {
        id: "job_003",
        title: "Backend Developer",
        description: "Build scalable Node.js services.",
        experienceRequired: 3,
        location: "Mumbai",
        employmentType: "Full-time",
        salary: 950000,
      },
      {
        id: "job_004",
        title: "Cloud Engineer",
        description: "Build and manage cloud infrastructure.",
        experienceRequired: 3,
        location: "Bangalore",
        employmentType: "Full-time",
        salary: 1100000,
      },
    ];

    for (const job of jobs) {
      await session.run(
        `
        MERGE (j:Job {id: $id})
        SET
          j.title = $title,
          j.description = $description,
          j.experienceRequired = $experienceRequired,
          j.location = $location,
          j.employmentType = $employmentType,
          j.salary = $salary
        `,
        job,
      );
    }

    // --------------------------------------------------
    // 5. Candidate -> Skill relationships
    // --------------------------------------------------

    const candidateSkills = [
      ["candidate_001", "skill_001", "Advanced", 3],
      ["candidate_001", "skill_002", "Advanced", 3],
      ["candidate_001", "skill_003", "Intermediate", 2],
      ["candidate_001", "skill_004", "Advanced", 3],
      ["candidate_001", "skill_005", "Advanced", 3],
      ["candidate_001", "skill_006", "Intermediate", 2],
      ["candidate_001", "skill_007", "Intermediate", 2],

      ["candidate_002", "skill_001", "Advanced", 5],
      ["candidate_002", "skill_004", "Advanced", 5],
      ["candidate_002", "skill_008", "Advanced", 4],
      ["candidate_002", "skill_009", "Intermediate", 3],
      ["candidate_002", "skill_010", "Intermediate", 3],

      ["candidate_003", "skill_001", "Intermediate", 2],
      ["candidate_003", "skill_002", "Advanced", 2],
      ["candidate_003", "skill_003", "Advanced", 2],
      ["candidate_003", "skill_006", "Intermediate", 1],
    ];

    for (const [candidateId, skillId, proficiency, years] of candidateSkills) {
      await session.run(
        `
        MATCH (c:Candidate {id: $candidateId})
        MATCH (s:Skill {id: $skillId})

        MERGE (c)-[r:HAS_SKILL]->(s)

        SET
          r.proficiency = $proficiency,
          r.years = $years
        `,
        {
          candidateId,
          skillId,
          proficiency,
          years,
        },
      );
    }

    // --------------------------------------------------
    // 6. Job -> Skill relationships
    // --------------------------------------------------

    const jobSkills = [
      ["job_001", "skill_001"],
      ["job_001", "skill_002"],
      ["job_001", "skill_004"],
      ["job_001", "skill_005"],

      ["job_002", "skill_001"],
      ["job_002", "skill_002"],
      ["job_002", "skill_003"],
      ["job_002", "skill_006"],

      ["job_003", "skill_001"],
      ["job_003", "skill_004"],
      ["job_003", "skill_005"],
      ["job_003", "skill_008"],

      ["job_004", "skill_009"],
      ["job_004", "skill_010"],
      ["job_004", "skill_008"],
    ];

    for (const [jobId, skillId] of jobSkills) {
      await session.run(
        `
        MATCH (j:Job {id: $jobId})
        MATCH (s:Skill {id: $skillId})

        MERGE (j)-[:REQUIRES]->(s)
        `,
        {
          jobId,
          skillId,
        },
      );
    }

    // --------------------------------------------------
    // 7. Job -> Company relationships
    // --------------------------------------------------

    const jobCompanies = [
      ["job_001", "company_001"],
      ["job_002", "company_002"],
      ["job_003", "company_003"],
      ["job_004", "company_002"],
    ];

    for (const [jobId, companyId] of jobCompanies) {
      await session.run(
        `
        MATCH (j:Job {id: $jobId})
        MATCH (c:Company {id: $companyId})

        MERGE (j)-[:POSTED_BY]->(c)
        `,
        {
          jobId,
          companyId,
        },
      );
    }

    // --------------------------------------------------
    // 8. Candidate -> Company relationships
    // --------------------------------------------------

    const workHistory = [
      [
        "candidate_001",
        "company_001",
        "Software Developer",
        "2022-01-01",
        "2025-01-01",
      ],
      [
        "candidate_002",
        "company_002",
        "Senior Backend Developer",
        "2020-01-01",
        "2025-06-01",
      ],
      [
        "candidate_003",
        "company_003",
        "Frontend Developer",
        "2024-01-01",
        "2026-01-01",
      ],
    ];

    for (const [
      candidateId,
      companyId,
      role,
      startDate,
      endDate,
    ] of workHistory) {
      await session.run(
        `
        MATCH (c:Candidate {id: $candidateId})
        MATCH (company:Company {id: $companyId})

        MERGE (c)-[r:WORKED_AT]->(company)

        SET
          r.role = $role,
          r.startDate = $startDate,
          r.endDate = $endDate
        `,
        {
          candidateId,
          companyId,
          role,
          startDate,
          endDate,
        },
      );
    }

    // --------------------------------------------------
    // 9. Candidate -> Job applications
    // --------------------------------------------------

    const applications = [
      ["candidate_001", "job_001", "2026-08-01", "Interview"],
      ["candidate_002", "job_003", "2026-08-03", "Applied"],
      ["candidate_003", "job_002", "2026-08-04", "Shortlisted"],
    ];

    for (const [candidateId, jobId, appliedAt, status] of applications) {
      await session.run(
        `
        MATCH (c:Candidate {id: $candidateId})
        MATCH (j:Job {id: $jobId})

        MERGE (c)-[r:APPLIED_FOR]->(j)

        SET
          r.appliedAt = $appliedAt,
          r.status = $status
        `,
        {
          candidateId,
          jobId,
          appliedAt,
          status,
        },
      );
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
};

seedDatabase();
