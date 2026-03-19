const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      {
        voiceId: 'en-US-natalie',
        style: 'Calm',
        rate: -10,
        pitch: 0,
        text: text,
        format: 'MP3',
        modelVersion: 'GEN2'
      },
      {
        headers: {
          'api-key': process.env.MURF_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const audioUrl = response.data.audioFile;
    res.json({ audioUrl });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Murf API failed' });
  }
});

module.exports = router;