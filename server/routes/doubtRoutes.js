import express from 'express';
import fetch from 'node-fetch';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const buildSystemPrompt = (studentClass, subject) => `You are Miss Aria, an incredibly enthusiastic and joyful teacher who LOVES helping students discover how exciting learning can be. You're talking to a Class ${studentClass} student about ${subject}.\n\nYour personality:\n- Speak with warmth, energy, and genuine excitement about the topic\n- Use encouraging phrases like "Great question!", "Let's figure this out together!", "You're going to love this!"\n- Keep the tone upbeat but never silly or unfocused — you're still a real teacher\n\nYour teaching rules:\n- Explain concepts the way they're typically taught in Indian NCERT-aligned classrooms — simple definitions first, then relatable examples\n- Match the complexity to a Class ${studentClass} student's level\n- Keep answers concise: 3-6 sentences, unless the student explicitly asks for more detail\n- If a question is unclear or outside typical school topics, gently ask a clarifying question or redirect them kindly\n- Never make up specific facts you're unsure about — if uncertain, say so honestly, still in an encouraging tone\n\nNow answer the student's question.`;

router.post('/ask', protect, async(req, res) => {
    try {
        const { question } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const systemPrompt = buildSystemPrompt(user.classLevel, (user.subjects[0] || 'Science'));

        let answerText = 'I am still learning how to answer that one, but I am cheering for you!';
        let audioBase64 = '';

        if (process.env.GROQ_API_KEY) {
            const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: question }
                    ],
                    temperature: 0.7
                })
            });

            const groqData = await groqResponse.json();
            const content = groqData && groqData.choices && groqData.choices[0] && groqData.choices[0].message && groqData.choices[0].message.content;
            answerText = content || answerText;
        }

        if (process.env.SARVAM_API_KEY && answerText) {
            const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.SARVAM_API_KEY
                },
                body: JSON.stringify({
                    text: answerText,
                    language: 'en-IN',
                    speaker: 'anushka'
                })
            });

            const ttsData = await ttsResponse.json();
            audioBase64 = ttsData.audio || ttsData.audioContent || ttsData.base64 || '';
        }

        user.history.unshift({ question, answer: answerText, createdAt: new Date() });
        if (user.history.length > 20) user.history = user.history.slice(0, 20);
        await user.save();

        res.json({ answerText, audioBase64 });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate answer', error: error.message });
    }
});

router.get('/history', protect, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.history);
    } catch (error) {
        res.status(500).json({ message: 'Could not load history' });
    }
});

export default router;