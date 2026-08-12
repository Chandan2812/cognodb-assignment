const {
  getAllCompanies,
  getCompanyById,
} = require("../services/companyService");

const getAllCompaniesController = async (req, res) => {
  try {
    const companies = await getAllCompanies();

    return res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Get companies error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch companies",
    });
  }
};

const getCompanyByIdController = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const company = await getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Get company error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch company",
    });
  }
};

module.exports = {
  getAllCompaniesController,
  getCompanyByIdController,
};
