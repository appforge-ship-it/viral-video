const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function splitIntoScenes(script, sceneCount = 4) {
  const lines = script.split('\n').filter(line => line.trim());
  const scenes = [];
  const linesPerScene = Math.ceil(lines.length / sceneCount);

  for (let i = 0; i < sceneCount; i++) {
    const startIdx = i * linesPerScene;
    const endIdx = Math.min((i + 1) * linesPerScene, lines.length);
    const sceneText = lines.slice(startIdx, endIdx).join(' ');

    if (sceneText.trim()) {
      scenes.push({
        scene: i + 1,
        text: sceneText.trim(),
        duration: 3,
        imagePrompt: sceneText.trim()
      });
    }
  }

  return scenes;
}

async function generateScriptWithAI(userPrompt, sceneCount) {
  try {
    const systemPrompt = `You are a creative video script writer. Generate a detailed video script based on the user's prompt. 
    The script should be cinematic and descriptive, suitable for a ${sceneCount}-scene video.
    Format your response as a continuous narrative that can be split into ${sceneCount} scenes.
    Make it vivid, engaging, and technical enough for AI video generation.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://novavideo-ai.local',
        'X-Title': 'NovaVideo AI'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const script = data.choices[0].message.content;

    return {
      script: script,
      scenes: splitIntoScenes(script, sceneCount)
    };
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

app.post('/api/generate-script', async (req, res) => {
  try {
    const { prompt, sceneCount } = req.body;

    if (!prompt || !sceneCount) {
      return res.status(400).json({
        success: false,
        error: 'Missing prompt or sceneCount'
      });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    const result = await generateScriptWithAI(prompt, sceneCount);

    res.json({
      success: true,
      script: result.script,
      scenes: result.scenes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate script'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NovaVideo AI Server is running' });
});

app.listen(PORT, () => {
  console.log(`✨ NovaVideo AI Server running on http://localhost:${PORT}`);
  console.log(`📹 Open http://localhost:${PORT} in your browser`);
});