require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const logger = require("../middleware/logger");


const client = new TwitterApi({
    appKey: process.env.CONSUMER_API_TOKEN_KEY,
    appSecret: process.env.CONSUMER_API_TOKEN_SECRET,
    accessToken: process.env.ACCESS_TOKEN_KEY,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
  });

async function postTweet(tweetText) {
    try {
        const tweet = await client.v2.tweet(tweetText);
        logger.info(`Tweet posted with ID ${tweet.data.id}`);
    } catch (error) {
        logger.error(`Failed to post tweet: ${error}`);
    }
}

module.exports = {postTweet}