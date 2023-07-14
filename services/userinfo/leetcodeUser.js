const https = require('https');

async function leetcode_u(handle) {
  const url = 'https://leetcode.com/graphql';

  const query = {
    operationName: 'getContentRankingData',
    variables: { username: handle },
    query: `
      query getContentRankingData($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          __typename
        }
      }
    `,
  };

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const request = https.request(url, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const userInfo = JSON.parse(data);
          if(userInfo.data.userContestRanking == null){
            userInfo.data.userContestRanking = {
                attendedContestsCount: 0,
                rating: 0,
                globalRanking: 0,
            }
          }
        //   console.log(userInfo);
          resolve(userInfo.data);
        } catch (error) {
          console.log('Error parsing JSON:', error);
          resolve({});
        }
      });
    });

    request.on('error', (error) => {
      console.log('Error getting user info:', error);
      reject(error);
    });

    request.write(JSON.stringify(query));
    request.end();
  });
}

module.exports = {
  leetcode_u,
};
