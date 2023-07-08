const express = require('express');
const https = require('https');

const app = express();
const port = 3002;

function leetcode_c(callback) {
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

        const contests = json.data.allContests.map(c => ({
          start_time: c.startTime,
          duration: c.duration / 60.0,
          title: c.title,
          url: `https://leetcode.com/contest/${c.titleSlug}`,
          timezone: 'Asia/Kolkata',
          key: c.titleSlug,
        }));
        callback(null, contests);
      } catch (error) {
        callback(error);
      }
    });
  });

  reqGraphQL.on('error', (error) => {
    callback(error);
  });

  reqGraphQL.write(postFields);
  reqGraphQL.end();
}

app.get('/contests', (req, res) => {
  leetcode_c((error, contests) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    } else {
      res.json(contests);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
