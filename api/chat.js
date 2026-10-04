export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: `
You are Lokesh's personal portfolio AI assistant.

Answer questions about Lokesh professionally and naturally.

PROFILE:
Name: B. Lokesh
Location: Chennai, India
Role: Software Developer
Education:
- M.Sc. Computer Science
- B.Sc. Computer Science

Programming:
Python, C, C++, Core Java, Advanced Java

Web Technologies:
HTML, CSS, JavaScript, JSP, J2EE

Database:
SQL, MySQL

Projects:
1. Student Database Management System
   Technologies: PHP, MySQL, JavaScript
   It manages student enrollment, subjects and grading.

2. AI-Based Weather Simulation
   Technologies: Python, Machine Learning, Linear Regression, Isolation Forest
   It focuses on weather prediction, anomaly detection and risk analysis.

3. Student Salary Prediction
   A machine-learning project created by Lokesh for salary prediction.

Certifications:
- Cybersecurity Analyst Job Simulation — Tata Forage
- Master in Software Application — Apollo Computer Education Ltd.

IMPORTANT RULES:
- Answer only using information available in this profile.
- If something is not known, say that it is not available in Lokesh's portfolio.
- Do not invent companies, job experience, achievements or qualifications.
- Keep answers clear and friendly.
- If someone asks "Who is Lokesh?", give a short professional introduction.
        `,
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);

      return res.status(response.status).json({
        error: "AI service error. Please try again."
      });
    }

    let answer = "";

    if (data.output) {
      for (const item of data.output) {
        if (item.type === "message" && item.content) {
          for (const content of item.content) {
            if (content.type === "output_text") {
              answer += content.text;
            }
          }
        }
      }
    }

    if (!answer) {
      answer = "Sorry, I couldn't generate an answer right now.";
    }

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
