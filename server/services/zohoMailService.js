import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function getAccessToken() {
  const url = "https://accounts.zoho.com/oauth/v2/token";
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const { data } = await axios.post(url, params);
  return data.access_token;
}

export async function sendZohoMail(subject, firstName, phone, email, notes) {
  const token = await getAccessToken();

  // Preserve line breaks by wrapping in pre tags or using <br /> tags
  const formattedContent = `<pre style="font-family: monospace; white-space: pre-wrap;">${notes}</pre>`;
    const formattedFromAddress = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;

  const payload = {
    fromAddress: formattedFromAddress,
    toAddress: process.env.TO_EMAIL,
      ccAddress: process.env.CC_EMAIL,
    subject: `${subject} from ${firstName}`,
    content: formattedContent,
  };

  const { data } = await axios.post(
      `${process.env.ZOHO_API_DOMAIN}/api/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
  );

  return data;
}
