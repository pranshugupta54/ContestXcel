const https = require("https");

async function codeforces_u(handle) {
  const url = `https://codeforces.com/api/user.info?handles=${handle}`;

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const userInfo = JSON.parse(data);
          // console.log("INFOOOOOOOOOOO");
          // console.log(userInfo);
          resolve(userInfo.result[0]);
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
  });
}

module.exports = {
  codeforces_u,
};
