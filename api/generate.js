import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { jobTitle, seniorityLevel } = req.body;
    const level = seniorityLevel || 'Mid-Level';

    if (!jobTitle || jobTitle.trim() === '') {
        return res.status(400).json({ error: 'Job title is required.' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY environment variable.");
            return res.status(500).json({ error: 'Server configuration error. API Key missing.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an expert technical recruiter and hiring manager.
Generate exactly 3 thoughtful, specific, and challenging interview questions for a "${level} ${jobTitle}" role.
The questions should be appropriate for ${level}-level candidates.
Do not include any pleasantries or introductory text.
Return the result as a simple JSON array of objects, like this:
[
  {
    "question": "The interview question text?",
    "lookFor": ["Point 1 to look for", "Point 2 to look for"],
    "redFlags": ["Red flag 1", "Red flag 2"]
  }
]
Ensure the response is valid JSON.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let questions = [];
        try {
            const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
            questions = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Error parsing Gemini response as JSON:", responseText);
            questions = responseText
                .split('\n')
                .filter(q => q.trim() !== '')
                .map(q => q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
                .slice(0, 3);
        }

        if (!questions || questions.length === 0) {
            return res.status(500).json({ error: 'Failed to generate interview questions.' });
        }

        return res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in generate function:', error);
        return res.status(500).json({ error: 'Failed to connect to the AI service. Please try again later.' });
    }
}
