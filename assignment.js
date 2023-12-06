const { Configuration, OpenAIApi } = require("openai");  //a package for accessing OpenAI's GPT models
const Fuse = require('fuse.js'); //used to implement search functionality that allows users to find relevant results even if their queries contain typos or are not an exact match.

const OPENAI_API_KEY = "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";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/*
 Q) Consolidate best practices from multiple articles meaning ?
 -> Consolidate best practices from multiple articles" refers to the process of gathering and combining the best practices mentioned in multiple articles into a single list or repository. 
 -> The goal is to create a comprehensive compilation of best practices on a particular topic by extracting and aggregating the relevant information from different sources.
 
 Q) Citation meaning?
 -> Citation refers to a reference to a source of information
 -> Citations typically include information such as the author's name, the title of the work, the publication or source where it can be found, and other relevant details such as the publication date or page numbers.

 -> fuse.js library is used to implement search functionality that allows users to find relevant results even if their queries contain typos or are not an exact match.
 -> Fuzzy search is a search algorithm used in fuse.js, which is a JavaScript library for searching and filtering data. 
 -> Fuzzy search provides approximate search results based on the matching of substrings, allowing for spelling errors, typos, and other forms of approximate matches. 
 -> This makes it a useful tool for providing suggestions and autocompletion in search fields and forms, even when the user’s input does not match exactly with the data being searched. 
*/
 
async function getBestPracticesFromChatGPT(inputText) {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Extract best practices from the following article body:\n\n" + inputText,
    });
    console.log(completion.data.choices[0].text);
}

function findSimilarPracticeInList(consolidatedList, practice) {

    const options = {
      includeScore: true,
      threshold: 0.7,
      keys: ['practice']
    };
    
    const fuse = new Fuse(consolidatedList, options);
  
    // Search for similar practices
    const results = fuse.search(practice);
  
    // Check if any similar practice was found
    if (results.length > 0) {
      const bestMatch = results[0]; // Get the best match
      const similarityScore = bestMatch.score; // Get the similarity score
    
      // If the similarity score is below the threshold, consider it as not similar
      if (similarityScore <= options.threshold) {    
        return null;
      }
  
      // Return the entry with the best match
      return bestMatch.item;
    }
  
    // If no similar practice is found, return null
    return null;
}

async function getConsolidatedBestPractices(articles) {
    
    let consolidatedList = [];

    for (let article of articles) {

      let { headline, body } = article;
  
      // Use ChatGPT API to extract best practices from the article body
      let extractedBestPracticesFromChatGPT = await getBestPracticesFromChatGPT(body);
  
      for (let practice of extractedBestPracticesFromChatGPT) {
        let existingPractice = findSimilarPracticeInList(consolidatedList,practice.practice);  
        
        if (existingPractice)
          existingPractice.citations.push({ article: headline, discussion: practice.discussion });
        else
          consolidatedList.push({ practice: practice.practice, citations: [{ article: headline, discussion: practice.discussion }] });
      }
    }
    return consolidatedList;
}

let articles = [
    {
      "article-headline": "21 Social Media Best Practices to Follow in 2023",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "23 Social Media Best Practices for Success in 2023",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "10 proven social media best practices for 2023",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "Social Media Best Practices - Communications",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "50 Social Media Best Practices Every Business Should Follow",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "Social Media Best Practices - UCSB brand guidelines",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "17 Social Media Best Practices To Implement in 2023",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "2021 Social Media Marketing Best Practices",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "21 Social Media Best Practices to Follow in 2023",
      "article-body": "Article Body"
    },
    {
      "article-headline": "Data Proven Social Media Best Practices",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "5 Tips to Successful Social Media Marketing | PRLab",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "15 Social Media Tips to Elevate Your Marketing Strategy",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "Social Media Marketing for Businesses",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "Social media marketing best practices you need to know now",
      "article-body": "Dummy Article Body"
    },
    {
      "article-headline": "Social Media Marketing: The Ultimate Guide",
      "article-body": "Dummy Article Body"
    }
]

let consolidatedList = await getConsolidatedBestPractices(articles);
console.log(consolidatedList);