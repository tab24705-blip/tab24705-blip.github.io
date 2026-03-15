const CRYPVOREX_AI_KEY = 'AIzaSyBWJsYO2JEeN7btncJUqj1-_DrKjZmnCvA';
const GEMINI_EP = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CRYPVOREX_AI_KEY}`;

const CrypvorexAI = {
    sys: `You are the Crypvorex Intelligence Engine — a proprietary AI system of Crypvorex, a premier boutique Web3 strategy consultancy. Tone: authoritative, concise, institutional. Never use emojis. State things with conviction. Keep responses under 250 words.`,

    async gen(prompt, opts = {}) {
        const { temp = 0.7, max = 500 } = opts;
        try {
            const r = await fetch(GEMINI_EP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${this.sys}\n\n${prompt}` }] }],
                    generationConfig: { temperature: temp, maxOutputTokens: max, topP: 0.9 },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                })
            });
            if (!r.ok) throw new Error(r.status);
            const d = await r.json();
            return d.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } catch (e) { console.warn('AI:', e); return null; }
    },

    async sentiment(prices) {
        return this.gen(`Given these crypto prices: ${JSON.stringify(prices)}. Write ONE institutional-grade market sentiment sentence (max 18 words). Format: "SENTIMENT_WORD: analysis". Example: "RISK-ON: Broad momentum across majors signals institutional re-allocation into digital assets."`, { temp: 0.6, max: 60 });
    },

    async thesis() {
        return this.gen(`Write a 2-sentence institutional market thesis for today's crypto market. Reference real trends like RWA growth, ETH staking yields, BTC ETF flows, or DeFi innovation. Sound like a Goldman Sachs morning note.`, { temp: 0.7, max: 120 });
    },

    async heroLine() {
        return this.gen(`Generate a single compelling subtitle (max 15 words) for a Web3 strategy consultancy homepage. Reference current market conditions. Sound like McKinsey. No quotes.`, { temp: 0.8, max: 40 });
    },

    async assess(d) {
        return this.gen(`Strategic assessment for a Web3 project:\n- Type: ${d.projectType}\n- Stage: ${d.stage}\n- Challenge: ${d.challenge}\n- Market: ${d.market}\n- Team: ${d.teamSize}\n- Funding: ${d.funding}\n\nProvide:\n1. READINESS SCORE (1-10) with justification\n2. TOP 3 PRIORITIES (one line each)\n3. RECOMMENDED TIER (Advisory/Strategic/Enterprise)\n4. KEY RISKS (2 bullets)\n5. RECOMMENDATION (2 sentences)\n\nFormat as professional memo.`, { temp: 0.5, max: 700 });
    },

    async cmdQuery(q) {
        return this.gen(`User searched: "${q}" on a Web3 consultancy site. If it's a crypto ticker (BTC, ETH, SOL etc), give current analysis in 1 sentence. If it's a concept (DeFi, tokenomics, RWA), give a 2-sentence strategic perspective. If unclear, suggest what they might be looking for. Max 40 words.`, { temp: 0.6, max: 80 });
    },

    async newsletterBrief() {
        return this.gen(`Generate "This Week in Web3" 4-bullet executive brief. Cover: 1 macro trend, 1 DeFi development, 1 regulatory update, 1 alpha opportunity. One sentence each. End: "Full analysis reserved for engaged clients."`, { temp: 0.7, max: 250 });
    }
};
