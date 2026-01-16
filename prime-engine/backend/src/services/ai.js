const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateApp = async (prompt) => {
  try {
    const systemPrompt = `You are an expert full-stack developer. Generate a complete web application based on the user's description.

Return a JSON object with the following structure:
{
  "name": "App name",
  "description": "Brief app description",
  "canvasState": {
    "pages": [
      {
        "id": "unique-id",
        "name": "Page Name",
        "route": "/route",
        "components": [
          {
            "id": "comp-id",
            "type": "container|text|button|input|image|navbar|footer|card|form",
            "props": {},
            "children": [],
            "styles": {}
          }
        ]
      }
    ],
    "theme": {
      "primaryColor": "#6366f1",
      "backgroundColor": "#0f172a",
      "textColor": "#f8fafc"
    }
  },
  "code": {
    "frontend": {
      "pages": {},
      "components": {}
    },
    "backend": {
      "routes": {},
      "models": {}
    }
  }
}

Generate modern, responsive, and visually appealing designs. Use proper semantic HTML and React best practices.`;

    let text = '';

    // Prefer Google AI (Gemini) if key is present
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log('Using Gemini for generation...');
      const result = await geminiModel.generateContent([systemPrompt, `Generate an app for: ${prompt}`]);
      text = result.response.text();
    } else if (process.env.OPENAI_API_KEY) {
      console.log('Using OpenAI for generation...');
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate an app for: ${prompt}` },
        ],
        response_format: { type: 'json_object' },
      });
      text = response.choices[0].message.content;
    } else {
      throw new Error('No AI service configured');
    }

    // Clean up text if it contains markdown code blocks
    text = text.replace(/```json\n?/, '').replace(/\n?```/, '').trim();

    // Parse JSON response
    const generated = JSON.parse(text);

    return {
      name: generated.name || 'Untitled App',
      description: generated.description || '',
      canvasState: JSON.stringify(generated.canvasState || {}),
      code: JSON.stringify(generated.code || {}),
    };
  } catch (error) {
    console.error('AI generation error:', error);

    // Return fallback structure
    return {
      name: 'New App',
      description: 'Generated application',
      canvasState: JSON.stringify({
        pages: [
          {
            id: 'home',
            name: 'Home',
            route: '/',
            components: [
              {
                id: 'nav',
                type: 'navbar',
                props: { title: 'My App' },
                children: [],
                styles: {}
              },
              {
                id: 'hero',
                type: 'container',
                props: {},
                children: [
                  {
                    id: 'hero-title',
                    type: 'text',
                    props: { content: 'Welcome to My App', variant: 'h1' },
                    children: [],
                    styles: {}
                  }
                ],
                styles: {}
              }
            ]
          }
        ],
        theme: {
          primaryColor: '#6366f1',
          backgroundColor: '#0f172a',
          textColor: '#f8fafc'
        }
      }),
      code: JSON.stringify({}),
    };
  }
};

module.exports = { generateApp };
