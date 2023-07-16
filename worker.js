addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {           // change account name in url
  const response = await fetch("https://api.github.com/orgs/ACCOUNTNAME/repos", {
    headers: {
      "Authorization": ` GITHUB TOKEN HERE `, // github token
      "User-Agent": " USER AGENT " // user-agent name
    }
  });

  const repos = await response.json();
  const unarchivedRepos = repos.filter(repo => !repo.archived && repo.name !== ".github"); // ignores archived and .github
  
  const repoData = await Promise.all(
    unarchivedRepos.map(async repo => {                         // change account name in url
      const commitResponse = await fetch(`https://api.github.com/repos/ACCOUNTNAME/${repo.name}/commits`, { 
        headers: {
          "Authorization": ` GITHUB TOKEN HERE `, // github token
          "User-Agent": " USER AGENT " //user-agent name
        }
      });
  
      const commits = await commitResponse.json();
      return { name: repo.name, 
      latestCommit: commits[0].sha,
      repolink: repo.html_url,
      repodesc: repo.description,
      updated: repo.updated_at };
    })
  );

  return new Response(JSON.stringify(repoData), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
