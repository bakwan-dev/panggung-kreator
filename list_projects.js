const https = require('https');
const fs = require('fs');

const tokens = [
  process.env.SUPABASE_ACCESS_TOKEN
].filter(Boolean);

function fetchProjects(tokenIndex = 0) {
  if (tokenIndex >= tokens.length) {
    console.error("All tokens failed.");
    fs.writeFileSync('projects.json', JSON.stringify({ error: "All tokens failed" }, null, 2));
    return;
  }

  const token = tokens[tokenIndex];
  console.log(`Trying token ${tokenIndex + 1}...`);

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: '/v1/projects',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'node.js'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log("Success! Writing to projects.json");
        fs.writeFileSync('projects.json', JSON.stringify(JSON.parse(data), null, 2));
      } else {
        console.warn(`Token ${tokenIndex + 1} failed with status ${res.statusCode}: ${data}`);
        fetchProjects(tokenIndex + 1);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    fetchProjects(tokenIndex + 1);
  });

  req.end();
}

fetchProjects();
