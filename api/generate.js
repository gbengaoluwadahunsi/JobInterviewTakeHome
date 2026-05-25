import { GoogleGenerativeAI } from '@google/generative-ai';

const FALLBACK_SIGNALS = {
    lookFor: [
        'A structured answer with specific examples and measurable impact',
        'Clear reasoning about tradeoffs, stakeholders, and execution details'
    ],
    redFlags: [
        'Vague answers without concrete ownership or outcomes',
        'Overly generic responses that do not match the role context'
    ]
};

function buildFallbackQuestions(jobTitle, level) {
    return [
        {
            question: `Tell me about a time you solved a difficult problem in a ${jobTitle} role. What made it difficult, and how did you decide what to do?`,
            ...FALLBACK_SIGNALS
        },
        {
            question: `What are the most important success metrics for a ${level} ${jobTitle}, and how would you improve one of them in your first 90 days?`,
            ...FALLBACK_SIGNALS
        },
        {
            question: `Describe a situation where you had to work with unclear requirements or conflicting priorities as a ${jobTitle}. How did you create alignment?`,
            ...FALLBACK_SIGNALS
        }
    ];
}

function parseQuestions(responseText) {
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();

    try {
        const parsed = JSON.parse(cleanedText);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return cleanedText
            .split('\n')
            .map(q => q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
            .filter(Boolean)
            .slice(0, 3)
            .map(question => ({ question, ...FALLBACK_SIGNALS }));
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { jobTitle, seniorityLevel } = req.body || {};
    const title = typeof jobTitle === 'string' ? jobTitle.trim() : '';
    const level = seniorityLevel || 'Mid-Level';

    if (!title) {
        return res.status(400).json({ error: 'Job title is required.' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY environment variable.");
            return res.status(200).json({
                questions: buildFallbackQuestions(title, level),
                warning: 'Gemini API key is missing, so fallback questions were generated.'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `You are an expert technical recruiter and hiring manager.
Generate exactly 3 thoughtful, specific, and challenging interview questions for a "${level} ${title}" role.
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

        const questions = parseQuestions(responseText);

        if (!questions || questions.length === 0) {
            console.error('Gemini returned no usable questions:', responseText);
            return res.status(200).json({
                questions: buildFallbackQuestions(title, level),
                warning: 'The AI response was empty, so fallback questions were generated.'
            });
        }

        return res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in generate function:', error);
        return res.status(200).json({
            questions: buildFallbackQuestions(title, level),
            warning: 'The AI service was unavailable, so fallback questions were generated.'
        });
    }
}
