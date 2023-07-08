const https = require("https");

async function codeforces_c() {
  const url = "https://codeforces.com/api/contest.list";

  const promise = new Promise((resolve, reject) => {
    https.get(url, function (response) {
      if (response.statusCode === 200) {
        resolve(response);
      } else {
        reject(new Error("Error getting contests"));
      }
    });
  });

  const filteredContestsPromise = promise.then(function (response) {
    let list = "";

    response.on("data", function (data) {
      list += data;
    });

    return new Promise((resolve) => {
      response.on("end", function () {
        try {
          const contestList = JSON.parse(list.toString());
          const filteredContests = contestList.result.filter(
            (contest) => contest.relativeTimeSeconds < 0
          );

          const contestsWithHost = filteredContests.map((contest) => ({
            ...contest,
            link: "https://codeforces.com/contest/" + contest.id,
            host: "codeforces.com",
          }));

          resolve(contestsWithHost);
        } catch (error) {
          console.log("Error parsing JSON:", error);
          resolve([]);
        }
      });
    });
  });

  return filteredContestsPromise;
}

module.exports = {
  codeforces_c,
};
