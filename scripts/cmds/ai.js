-cmd install ai.js const axios = require('axios');

const Prefixes = [
  'orochi',
  'ai',
  'chatgpt',
  'gpt',
  '.ai',
];

module.exports = {
  config: {
    name: "ai",
    version: 1.0,
    author: "Gohime Hatake",
    longDescription: "AI",
    category: "CHATGPT",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("YES.......?");
        return;
      }


      const response = await axios.get(`https://AryanAPI.replit.app/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply(`𝗚𝗼𝗵𝗶𝗺𝗲'𝘀 𝗕𝗼𝘁 😼\n_________________________\n\n${answer}\n_________________________`);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
