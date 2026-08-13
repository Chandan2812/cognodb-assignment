# CognoDB Assignment --- TalentGraph

A graph-powered talent discovery and job recommendation application
built with **Next.js**, **Node.js/Express.js**, and **CognoDB**.

The application models candidates, skills, jobs, and companies as a
connected graph and uses graph traversal to recommend jobs based on the
skills a candidate possesses.

------------------------------------------------------------------------

## 1. Project Overview

### Problem

A candidate can have many skills, while different jobs require different
combinations of skills. A useful recommendation system should not only
list available jobs, but understand the relationships between:

-   Candidates
-   Skills
-   Jobs
-   Companies

### Solution

TalentGraph uses CognoDB as a graph database to model these entities and
their relationships.

The recommendation engine traverses:

``` text
Candidate
    ↓ HAS_SKILL
  Skill
    ↑ REQUIRES
   Job
```

The matching skills are collected and used to calculate a match
percentage.

The application also provides an interactive graph explorer so users can
inspect relationships between candidates, skills, jobs, and companies.

------------------------------------------------------------------------

## 2. Why a Graph Database?

The core questions in this application are relationship-oriented.

For example:

> Which jobs are connected to this candidate through the skills they
> have?

The main recommendation traversal is:

``` text
Candidate → HAS_SKILL → Skill ← REQUIRES ← Job
```

This can be expressed directly with Cypher:

``` cypher
MATCH (c:Candidate {id: $candidateId})
      -[:HAS_SKILL]->(s:Skill)
      <-[:REQUIRES]-(j:Job)
```

This makes the graph model useful for discovering connected
opportunities rather than treating candidates, skills, and jobs as
unrelated records.

------------------------------------------------------------------------

## 3. Graph Data Model

The application currently uses four main node types.

### Candidate

Important properties:

-   `id`
-   `name`
-   `email`
-   `experience`
-   `location`

### Skill

Important properties:

-   `id`
-   `name`
-   `category`

### Job

Important properties:

-   `id`
-   `title`
-   `description`
-   `experienceRequired`
-   `location`
-   `employmentType`
-   `salary`

### Company

Important properties:

-   `id`
-   `name`
-   `location`
-   `industry`

### Relationships

  Relationship    Meaning
  --------------- -------------------------------------
  `HAS_SKILL`     A candidate has a particular skill
  `APPLIED_FOR`   A candidate applied for a job
  `WORKED_AT`     A candidate has worked at a company
  `REQUIRES`      A job requires a skill
  `POSTED_BY`     A job is posted by a company

### Graph Structure

``` text
Candidate
   │
   ├── HAS_SKILL ──────→ Skill
   │
   ├── APPLIED_FOR ────→ Job
   │                         │
   │                         ├── REQUIRES ──→ Skill
   │                         │
   │                         └── POSTED_BY ─→ Company
   │
   └── WORKED_AT ──────→ Company
```

------------------------------------------------------------------------

## 4. Example Graph Traversal

A candidate with these skills:

``` text
JavaScript
React
Node.js
Express.js
```

can be connected to a job requiring:

``` text
JavaScript
React
Node.js
Express.js
```

The resulting match is:

``` text
4 / 4 required skills
100% match
```

For a job requiring four skills where the candidate matches three:

``` text
3 / 4 required skills
75% match
```

Recommendations are ordered by match percentage in descending order.

------------------------------------------------------------------------

## 5. Recommendation Algorithm

The recommendation query performs the following steps:

1.  Find the candidate by `candidateId`.
2.  Traverse from the candidate to their skills.
3.  Find jobs that require those skills.
4.  Collect distinct matched skills for each job.
5.  Find the total number of skills required by each job.
6.  Calculate the number of matched skills.
7.  Calculate the match percentage.
8.  Order recommendations by match percentage.

Core query:

``` cypher
MATCH (c:Candidate {id: $candidateId})
      -[:HAS_SKILL]->(s:Skill)
      <-[:REQUIRES]-(j:Job)

WITH c, j, collect(DISTINCT s.name) AS matchedSkills

MATCH (j)-[:REQUIRES]->(requiredSkill:Skill)

WITH
  c,
  j,
  matchedSkills,
  count(DISTINCT requiredSkill) AS totalRequiredSkills

WITH
  c,
  j,
  matchedSkills,
  totalRequiredSkills,
  size(matchedSkills) AS matchedSkillCount

RETURN
  c.name AS candidate,
  j.id AS jobId,
  j.title AS job,
  j.description AS description,
  j.location AS location,
  j.employmentType AS employmentType,
  j.salary AS salary,
  matchedSkills,
  matchedSkillCount,
  totalRequiredSkills,
  CASE
    WHEN totalRequiredSkills = 0 THEN 0
    ELSE round(
      toFloat(matchedSkillCount) /
      totalRequiredSkills * 100
    )
  END AS matchPercentage

ORDER BY matchPercentage DESC
```

The `candidateId` is passed as a parameter rather than being directly
interpolated into the query.

------------------------------------------------------------------------

## 6. Graph Explorer

The application includes an interactive graph explorer.

It retrieves the candidate's connected graph and displays:

-   Candidate nodes
-   Skill nodes
-   Job nodes
-   Company nodes
-   Relationship types
-   Node properties

Example:

``` text
Candidate
   │
   ├── HAS_SKILL → JavaScript
   ├── HAS_SKILL → React
   ├── HAS_SKILL → Node.js
   │
   ├── APPLIED_FOR → Full Stack Developer
   │                              │
   │                              ├── REQUIRES → JavaScript
   │                              ├── REQUIRES → React
   │                              ├── REQUIRES → Node.js
   │                              └── POSTED_BY → TechNova
   │
   └── WORKED_AT → TechNova
```

Users can:

-   Click graph nodes
-   Inspect node properties
-   Inspect connected relationships
-   Drag nodes
-   Zoom the graph
-   Explore connected entities visually

------------------------------------------------------------------------

## 7. Application Architecture

``` text
                    ┌──────────────────────┐
                    │      Next.js         │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                              HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express / Node.js  │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Routes         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Controllers      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Services        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Cypher Queries    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       CognoDB        │
                    │      Graph DB        │
                    └──────────────────────┘
```

------------------------------------------------------------------------

## 8. Backend Project Structure

``` text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── candidateController.js
│   │   ├── companyController.js
│   │   ├── graphController.js
│   │   ├── jobController.js
│   │   ├── recommendationController.js
│   │   └── skillController.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   │
│   ├── query/
│   │   ├── candidateQueries.js
│   │   ├── companyQueries.js
│   │   ├── graphQueries.js
│   │   ├── jobQueries.js
│   │   ├── recommendationQueries.js
│   │   └── skillQueries.js
│   │
│   ├── route/
│   │   ├── candidateRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── graphRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── skillRoutes.js
│   │
│   ├── services/
│   │   ├── candidateServices.js
│   │   ├── companyServices.js
│   │   ├── graphServices.js
│   │   ├── jobServices.js
│   │   ├── recommendationServices.js
│   │   └── skillServices.js
│   │
│   └── utils/
│       └── neo4j.js
│
├── server.js
├── package.json
└── .env
```

### Folder responsibilities

  Folder          Responsibility
  --------------- -------------------------------------------------
  `config`        Database/driver configuration
  `controllers`   Handles HTTP requests and responses
  `middleware`    Error and not-found handling
  `query`         Cypher queries used with CognoDB
  `route`         API route definitions
  `services`      Application/business logic
  `utils`         Reusable helpers such as Neo4j value conversion

------------------------------------------------------------------------

## 9. Frontend

The frontend is built using:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Lucide icons
-   `react-force-graph-2d`

The main application provides:

### Candidate Selection

Users can select a candidate to load their information and graph.

### Candidate Profile

Displays candidate information and skills.

### Recommendations

Displays:

-   Job title
-   Location
-   Employment type
-   Salary
-   Match percentage
-   Matched skills
-   Skill match progress
-   Explanation of why the job matches

### Graph Explorer

Provides interactive exploration of the candidate's graph.

------------------------------------------------------------------------

## 10. API Overview

The backend exposes APIs for the main graph entities:

``` text
/api/candidates
/api/jobs
/api/skills
/api/companies
/api/graph
/api/candidates/:candidateId/recommendations
```

The backend also provides:

``` text
GET /api/health/db
```

to verify the CognoDB connection.

A successful database health response confirms that the backend can
communicate with CognoDB.

------------------------------------------------------------------------

## 11. Environment Variables

Create a `.env` file inside the backend project.

Example:

``` env
PORT=5000

# CognoDB connection
COGNODB_URI=your_cognodb_uri
COGNODB_USERNAME=your_username
COGNODB_PASSWORD=your_password
```

Do not commit `.env` to Git.

The frontend should use an environment variable for the backend API URL.

Example:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use production values when deploying.

------------------------------------------------------------------------

## 12. Local Setup

### Prerequisites

Make sure you have:

-   Node.js installed
-   A CognoDB database
-   CognoDB connection credentials
-   npm installed

### Clone the repository

``` bash
git clone <repository-url>
cd cognodb-assignment
```

------------------------------------------------------------------------

### Backend setup

``` bash
cd backend
npm install
```

Create the backend `.env` file with your CognoDB credentials.

Start the backend:

``` bash
npm run dev
```

The backend runs on:

``` text
http://localhost:5000
```

Health check:

``` text
http://localhost:5000/api/health/db
```

------------------------------------------------------------------------

### Frontend setup

Open another terminal:

``` bash
cd frontend
npm install
```

Create the frontend environment file:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start Next.js:

``` bash
npm run dev
```

The frontend will normally be available at:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## 13. Data Seeding

The project uses seeded graph data for the demonstration.

The seed data contains examples of:

-   Candidates
-   Skills
-   Jobs
-   Companies
-   Candidate skill relationships
-   Job skill requirements
-   Job/company relationships
-   Candidate/company relationships

After seeding, verify the graph through the application and the graph
API.

------------------------------------------------------------------------

## 14. Error Handling

The backend includes:

``` text
errorMiddleware.js
notFoundMiddleware.js
```

The frontend also provides loading and error states for API-driven
sections.

This prevents the application from displaying broken or empty UI without
feedback when an API request fails.

------------------------------------------------------------------------

## 15. Neo4j/CognoDB Value Normalization

Graph database integer values may be returned in a database-specific
representation.

The project includes:

``` text
src/utils/neo4j.js
```

for converting these values into normal JavaScript numbers before
returning API responses.

This keeps the database representation out of the frontend.

For example:

``` text
Database value
{ low: 3, high: 0 }

        ↓

API value
3
```

------------------------------------------------------------------------

## 16. Main Graph Queries

### Candidate recommendations

``` cypher
MATCH (c:Candidate {id: $candidateId})
      -[:HAS_SKILL]->(s:Skill)
      <-[:REQUIRES]-(j:Job)
```

This performs the core multi-hop relationship traversal used for
recommendations.

### Candidate graph

The graph query collects relationships from a candidate to:

-   Skills
-   Jobs
-   Companies

and then traverses job relationships to:

-   Required skills
-   Job companies

This powers the interactive graph explorer.

------------------------------------------------------------------------

## 17. Screenshots

Add final application screenshots here before submission.

Suggested screenshots:

### Dashboard

``` text
![Dashboard](https://github.com/user-attachments/assets/bebcfbeb-109c-4387-a898-9c2d4eaa15c3)

```

### Recommendation Results

``` text
![Recommendation Results](https://github.com/user-attachments/assets/2c551613-4c4c-4aee-9f3d-1edfd4a0a7db)

```

### Interactive Graph Explorer

``` text
![Interactive Graph Explorer](https://github.com/user-attachments/assets/0bbd8ae9-6ca6-46c4-8785-5645d0853ba4)

```

### Node Details

``` text
![Node Details](https://github.com/user-attachments/assets/eae20821-5ee0-4d68-a096-ff4aaea142e2)

```

------------------------------------------------------------------------

## 18. Demo

Add the deployed application URL here:

``` text
Live Demo:
[<deployment-url>](https://cognodb-assignment-sigma.vercel.app/)
```

Add the short screen recording URL here:

``` text
Demo Video:
<video-url>
```

------------------------------------------------------------------------

## 19. Tech Stack

### Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Lucide React
-   React Force Graph

### Backend

-   Node.js
-   Express.js
-   JavaScript
-   Cypher

### Database

-   CognoDB
-   Graph data model
-   Graph traversal

------------------------------------------------------------------------

## 20. Future Improvements

Possible future improvements include:

-   More sophisticated recommendation scoring
-   Skill proficiency and experience weighting
-   Filtering recommendations by location
-   Filtering by employment type
-   Company-level exploration
-   More graph traversal paths
-   Authentication and user accounts
-   Saved jobs
-   Candidate/job search
-   Recommendation history
-   More advanced graph analytics

------------------------------------------------------------------------

## 21. Conclusion

TalentGraph demonstrates a graph-oriented approach to talent discovery.

Instead of treating candidates, skills, jobs, and companies as isolated
records, the application models their relationships directly and uses
those connections to answer meaningful questions.

The central graph traversal:

``` text
Candidate
    ↓
HAS_SKILL
    ↓
Skill
    ↑
REQUIRES
    ↑
Job
```

provides the foundation for the recommendation engine, while the
interactive graph explorer makes those relationships visible to users.

------------------------------------------------------------------------

## License

This project was created as part of the CognoDB assignment.
