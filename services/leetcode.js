const https = require("https");

async function leetcode_c() {
  return new Promise((resolve, reject) => {
    const postFields = JSON.stringify({
      operationName: null,
      variables: {},
      query: `{
        allContests {
          title
          titleSlug
          description
          startTime
          duration
        }
      }`
    });

    const options = {
      hostname: 'leetcode.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postFields.length
      }
    };

    const reqGraphQL = https.request(options, (resGraphQL) => {
      let data = '';

      resGraphQL.on('data', (chunk) => {
        data += chunk;
      });

      resGraphQL.on('end', () => {
        try {
          const json = JSON.parse(data);

          if (!json.data || !json.data.allContests) {
            throw new Error('Invalid response');
          }

          const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds

          const contests = json.data.allContests
            .filter(c => c.startTime > currentTimestamp) // Filter contests with start time in the future
            .map(c => ({
              startTimeSeconds: c.startTime,
              durationSeconds: c.duration / 60.0,
              name: c.title,
              type:'Leet',
              url: `https://leetcode.com/contest/${c.titleSlug}`,
              timezone: 'Asia/Kolkata',
              host: 'leetcode.com',
              id: c.titleSlug,
            }));
            
          resolve(contests);
        } catch (error) {
          reject(error);
        }
      });
    });

    reqGraphQL.on('error', (error) => {
      reject(error);
    });

    reqGraphQL.write(postFields);
    reqGraphQL.end();
  });
}

module.exports = {
  leetcode_c
};
