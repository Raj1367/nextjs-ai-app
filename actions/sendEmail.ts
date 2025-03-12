"user server"
import { Resend } from "resend";

const sendEmail = async ({to,subject,react}) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "wealth-ai <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    return { success: true, data };
  } 
  catch (error: any) {
    console.log(error.message || error);
    return { success: false, error };
  }
};

export default sendEmail