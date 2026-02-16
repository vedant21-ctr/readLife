import axios from 'axios';
import Content from '../models/Content.js';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

export const fetchAndStoreNews = async () => {
  if (!NEWS_API_KEY) {
    console.log('News API key not configured. Using mock data.');
    return createMockNews();
  }

  try {
    const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
      params: {
        country: 'us',
        pageSize: 50,
        apiKey: NEWS_API_KEY
      }
    });

    const articles = response.data.articles;

    for (const article of articles) {
      if (!article.title || article.title === '[Removed]') continue;

      const externalId = `news_${article.url}`;
      
      const existingContent = await Content.findOne({ externalId });
      if (existingContent) continue;

      await Content.create({
        type: 'news',
        title: article.title,
        author: article.author || 'Unknown',
        source: article.source?.name || 'Unknown',
        url: article.url,
        imageUrl: article.urlToImage,
        description: article.description || '',
        category: 'general',
        publishedAt: article.publishedAt || new Date(),
        externalId
      });
    }

    console.log(`Fetched and stored ${articles.length} news articles`);
    return articles.length;
  } catch (error) {
    console.error('Error fetching news:', error.message);
    return createMockNews();
  }
};

const createMockNews = async () => {
  const mockArticles = [
    {
      type: 'news',
      title: 'Breaking: Major Tech Company Announces New AI Innovation',
      author: 'John Smith',
      source: 'Tech News Daily',
      url: 'https://example.com/article1',
      imageUrl: 'https://via.placeholder.com/400x200/667eea/ffffff?text=Tech+News',
      description: 'A leading technology company has unveiled groundbreaking artificial intelligence technology that promises to revolutionize the industry.',
      category: 'technology',
      publishedAt: new Date(),
      externalId: 'mock_news_1'
    },
    {
      type: 'news',
      title: 'Global Climate Summit Reaches Historic Agreement',
      author: 'Sarah Johnson',
      source: 'World News Network',
      url: 'https://example.com/article2',
      imageUrl: 'https://via.placeholder.com/400x200/10b981/ffffff?text=Climate+News',
      description: 'World leaders have come together to sign a landmark climate agreement aimed at reducing carbon emissions by 50% over the next decade.',
      category: 'environment',
      publishedAt: new Date(Date.now() - 3600000),
      externalId: 'mock_news_2'
    },
    {
      type: 'news',
      title: 'Stock Markets Hit Record Highs Amid Economic Recovery',
      author: 'Michael Chen',
      source: 'Financial Times',
      url: 'https://example.com/article3',
      imageUrl: 'https://via.placeholder.com/400x200/f59e0b/ffffff?text=Business+News',
      description: 'Major stock indices reached all-time highs today as investors show confidence in the ongoing economic recovery.',
      category: 'business',
      publishedAt: new Date(Date.now() - 7200000),
      externalId: 'mock_news_3'
    },
    {
      type: 'news',
      title: 'New Medical Breakthrough Offers Hope for Cancer Treatment',
      author: 'Dr. Emily Rodriguez',
      source: 'Medical Journal',
      url: 'https://example.com/article4',
      imageUrl: 'https://via.placeholder.com/400x200/ef4444/ffffff?text=Health+News',
      description: 'Researchers have discovered a promising new treatment method that shows remarkable results in early clinical trials.',
      category: 'health',
      publishedAt: new Date(Date.now() - 10800000),
      externalId: 'mock_news_4'
    },
    {
      type: 'news',
      title: 'Space Agency Announces Plans for Mars Mission',
      author: 'David Park',
      source: 'Space News',
      url: 'https://example.com/article5',
      imageUrl: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Space+News',
      description: 'A major space agency has revealed ambitious plans for a manned mission to Mars within the next five years.',
      category: 'science',
      publishedAt: new Date(Date.now() - 14400000),
      externalId: 'mock_news_5'
    },
    {
      type: 'news',
      title: 'Revolutionary Electric Vehicle Breaks Range Records',
      author: 'Lisa Anderson',
      source: 'Auto News',
      url: 'https://example.com/article6',
      imageUrl: 'https://via.placeholder.com/400x200/06b6d4/ffffff?text=Auto+News',
      description: 'A new electric vehicle model has shattered previous range records, traveling over 600 miles on a single charge.',
      category: 'technology',
      publishedAt: new Date(Date.now() - 18000000),
      externalId: 'mock_news_6'
    },
    {
      type: 'news',
      title: 'Major Sports Championship Delivers Thrilling Finale',
      author: 'Tom Williams',
      source: 'Sports Daily',
      url: 'https://example.com/article7',
      imageUrl: 'https://via.placeholder.com/400x200/f97316/ffffff?text=Sports+News',
      description: 'The championship game ended in dramatic fashion with a last-second victory that will be remembered for years.',
      category: 'sports',
      publishedAt: new Date(Date.now() - 21600000),
      externalId: 'mock_news_7'
    },
    {
      type: 'news',
      title: 'Education Reform Bill Passes with Bipartisan Support',
      author: 'Jennifer Lee',
      source: 'Political Review',
      url: 'https://example.com/article8',
      imageUrl: 'https://via.placeholder.com/400x200/ec4899/ffffff?text=Politics+News',
      description: 'A comprehensive education reform bill has been passed with overwhelming support from both parties.',
      category: 'politics',
      publishedAt: new Date(Date.now() - 25200000),
      externalId: 'mock_news_8'
    }
  ];

  let created = 0;
  for (const article of mockArticles) {
    const existing = await Content.findOne({ externalId: article.externalId });
    if (!existing) {
      await Content.create(article);
      created++;
    }
  }

  console.log(`Created ${created} mock news articles`);
  return created;
};

export const fetchArxivPapers = async () => {
  const mockPapers = [
    {
      type: 'journal',
      title: 'Advances in Deep Learning for Natural Language Processing',
      author: 'Dr. Alan Turing et al.',
      source: 'arXiv',
      url: 'https://arxiv.org/abs/example1',
      description: 'This paper presents novel approaches to natural language understanding using transformer architectures.',
      category: 'Computer Science',
      publishedAt: new Date(Date.now() - 86400000),
      externalId: 'arxiv_1'
    },
    {
      type: 'journal',
      title: 'Quantum Computing Applications in Cryptography',
      author: 'Dr. Marie Curie et al.',
      source: 'arXiv',
      url: 'https://arxiv.org/abs/example2',
      description: 'An exploration of quantum algorithms and their implications for modern cryptographic systems.',
      category: 'Physics',
      publishedAt: new Date(Date.now() - 172800000),
      externalId: 'arxiv_2'
    },
    {
      type: 'journal',
      title: 'Machine Learning in Medical Diagnosis',
      author: 'Dr. Florence Nightingale et al.',
      source: 'arXiv',
      url: 'https://arxiv.org/abs/example3',
      description: 'A comprehensive study on applying machine learning techniques to improve medical diagnostic accuracy.',
      category: 'Medicine',
      publishedAt: new Date(Date.now() - 259200000),
      externalId: 'arxiv_3'
    }
  ];

  let created = 0;
  for (const paper of mockPapers) {
    const existing = await Content.findOne({ externalId: paper.externalId });
    if (!existing) {
      await Content.create(paper);
      created++;
    }
  }

  console.log(`Created ${created} mock journal papers`);
  return created;
};

export const fetchBooks = async () => {
  const mockBooks = [
    {
      type: 'book',
      title: 'The Art of Computer Programming',
      author: 'Donald Knuth',
      source: 'Google Books',
      url: 'https://books.google.com/example1',
      imageUrl: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Programming',
      description: 'A comprehensive monograph written by Donald Knuth that covers many kinds of programming algorithms.',
      category: 'Computer Science',
      publishedAt: new Date('1968-01-01'),
      externalId: 'book_1'
    },
    {
      type: 'book',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      source: 'Google Books',
      url: 'https://books.google.com/example2',
      imageUrl: 'https://via.placeholder.com/300x400/10b981/ffffff?text=History',
      description: 'A narrative history of humanity from the Stone Age to the modern age.',
      category: 'History',
      publishedAt: new Date('2011-01-01'),
      externalId: 'book_2'
    },
    {
      type: 'book',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      source: 'Google Books',
      url: 'https://books.google.com/example3',
      imageUrl: 'https://via.placeholder.com/300x400/f59e0b/ffffff?text=Psychology',
      description: 'A groundbreaking tour of the mind explaining the two systems that drive the way we think.',
      category: 'Psychology',
      publishedAt: new Date('2011-10-25'),
      externalId: 'book_3'
    }
  ];

  let created = 0;
  for (const book of mockBooks) {
    const existing = await Content.findOne({ externalId: book.externalId });
    if (!existing) {
      await Content.create(book);
      created++;
    }
  }

  console.log(`Created ${created} mock books`);
  return created;
};
