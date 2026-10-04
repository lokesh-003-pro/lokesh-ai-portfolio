export default async function handler(req, res) {
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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `
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
- Python
- C
- C++
- Core Java
- Advanced Java

Web Technologies:
- HTML
- CSS
- JavaScript
- JSP
- J2EE

Database:
- SQL
- MySQL

Projects:

1. Student Database Management System
Technologies: PHP, MySQL, JavaScript.
The system manages student enrollment, subjects and grading. It includes class creation, subject assignment and automated result generation.

2. AI-Based Weather Simulation
Technologies: Python, Machine Learning, Linear Regression and Isolation Forest.
The project focuses on weather prediction, anomaly detection, risk analysis and alerts.

3. Student Salary Prediction
A machine-learning project focused on predicting salary using student and career-related input features.

Certifications:

1. Cybersecurity Analyst Job Simulation
Organization: Tata — Forage
Completed: June 2025
Skills/topics:
- IAM Fundamentals
- IAM Strategy
- Custom Solutions
- Platform Integration

2. Master in Software Application
Organization: Apollo Computer Education Ltd.
Completed: October 2025
Grade: A+
Covered:
- MS Office
- Python
- Advanced Python
- Core Java
- Advanced Java
- J2EE
- JSP
- HTML
- CSS
- JavaScript

IMPORTANT RULES:

- Answer only using the profile information provided above.
- Do not invent qualifications, companies, jobs or achievements.
- If information is unavailable, clearly say that it is not available in Lokesh's portfolio.
- Give clear, natural and professional answers.
- If asked about certifications, explain what each certification covered.
- If asked "Who is Lokesh?", provide a short professional introduction.
`
              }
            ]
          },

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(response.status).json({
        error: "Gemini API error. Please try again."
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("")
        .trim();

    if (!answer) {
      return res.status(500).json({
        error: "Gemini did not return an answer."
      });
    }

    return res.status(200).json({
      answer: answer
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
