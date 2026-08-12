require("dotenv").config();

const express = require("express");
const cors = require("cors");

const driver = require("./src/config/db");

const recommendationRoutes = require("./src/routes/recommendationRoutes");
const candidateRoutes = require("./src/routes/candidateRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const skillRoutes = require("./src/routes/skillRoutes");
const companyRoutes = require("./src/routes/companyRoutes");
const graphRoutes = require("./src/routes/graphRoutes");
const errorMiddleware = require("./src/middleware/errorMiddleware");
const notFoundMiddleware = require("./src/middleware/notFoundMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/candidates", candidateRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TalentGraph API is running",
  });
});

app.get("/api/health/db", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      RETURN "CognoDB connection successful" AS message
    `);

    res.json({
      success: true,
      message: result.records[0].get("message"),
    });
  } catch (error) {
    console.error("CognoDB connection error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to connect to CognoDB",
    });
  } finally {
    await session.close();
  }
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
