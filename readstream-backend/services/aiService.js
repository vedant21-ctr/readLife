import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export const generateSummary = async (content) => {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return 'AI summary generation is not configured. Please add GOOGLE_AI_API_KEY to your environment variables.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Please provide a concise summary (3-4 sentences) of the following content:

Title: ${content.title}
Description: ${content.description || 'No description available'}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary.trim();
  } catch (error) {
    console.error('Error generating summary:', error.message);
    return 'Unable to generate summary at this time. Please try again later.';
  }
};

export const generateRecommendations = async (userPreferences, savedContent) => {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return null;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const categories = userPreferences?.categories?.join(', ') || 'general';
    const recentTitles = savedContent.slice(0, 5).map(item => item.title).join(', ');

    const prompt = `Based on a user who is interested in ${categories} and has recently saved content about: ${recentTitles}, suggest 3 content categories or topics they might be interested in. Provide only the category names, separated by commas.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    return suggestions.trim().split(',').map(s => s.trim());
  } catch (error) {
    console.error('Error generating recommendations:', error.message);
    return null;
  }
};

export const generateDailyBrief = async (contents) => {
  try {
    if (!process.env.GOOGLE_AI_API_KEY || contents.length === 0) {
      return 'No content available for your daily briefing.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const contentList = contents.slice(0, 5).map((item, index) =>
      `${index + 1}. ${item.title} - ${item.source}`
    ).join('\n');

    const prompt = `Create a brief, engaging daily briefing (2-3 sentences) summarizing these top stories:

${contentList}

Daily Briefing:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const briefing = response.text();

    return briefing.trim();
  } catch (error) {
    console.error('Error generating daily brief:', error.message);
    return 'Unable to generate daily briefing at this time.';
  }
};

export const extractTopics = async (content) => {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return [];
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Extract 5 key topics or tags from the following content. Return only the topics as a comma-separated list:

Title: ${content.title}
Description: ${content.description || ''}

Topics:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.split(',').map(topic => topic.trim()).filter(Boolean);
  } catch (error) {
    console.error('Error extracting topics:', error.message);
    return [];
  }
};
