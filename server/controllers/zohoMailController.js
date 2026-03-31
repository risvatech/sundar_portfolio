import { sendZohoMail } from "../services/zohoMailService.js";

export const sendMailController = async (req, res) => {
  try {
    const {subject, firstName, phone, email, notes } = req.body;

    if (!firstName || !notes) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sendZohoMail(subject,firstName, phone, email, notes);
    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
      data: response,
    });
  } catch (error) {
    console.error(
      "Zoho Mail send error:",
      error.response?.data || error.message,
    );
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.response?.data || error.message,
    });
  }
};
