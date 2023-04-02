const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const express = require("express");
const app = express();
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
const { Configuration, OpenAIApi } = require("openai");

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/chat/, async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.replace('/chat', '');
  console.log(msg.text);
  try {
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: messageText }],
    });
    console.log(response.data.choices[0].message.content);
    bot.sendMessage(chatId,response.data.choices[0].message.content);
  } catch (err) {
    bot.sendMessage(chatId,err);
  }

});
bot.onText(/\/images/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.text);
    const messageText = msg.text.replace('/images', '');
    try {
      const response = await openAi.createImage({
          prompt: msg.text,
          n: 1,
          size: "1024x1024",
      });
      const image_url = response.data.data[0].url;
      console.log(image_url);
      bot.sendMessage(chatId,image_url);
    } catch (err) {
      bot.sendMessage(chatId,err);
    }
  
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await openAi.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: msg.text }],
        });
        console.log(response.data.choices[0].message.content);
        bot.sendMessage(chatId,response.data.choices[0].message.content);
      } catch (err) {
        bot.sendMessage(chatId,err);
      }
  
  });