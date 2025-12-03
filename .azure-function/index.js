// Azure Function to convert Azure DevOps webhooks to GitHub repository_dispatch
module.exports = async function (context, req) {
  context.log("Azure DevOps webhook received");

  // Extract work item data from Azure DevOps webhook
  const payload = req.body;
  const workItem = payload.resource;

  if (!workItem) {
    context.res = {
      status: 400,
      body: "No work item data found in request",
    };
    return;
  }

  const workItemId = workItem.id;
  const fields = workItem.fields || {};

  // Extract the HTML link from the message for a more reliable URL
  const htmlLink = payload.message?.html || "";
  const urlMatch = htmlLink.match(/href="([^"]+)"/);
  const workItemUrl = urlMatch ? urlMatch[1] : workItem.url;

  // Prepare GitHub repository_dispatch payload
  const githubPayload = {
    event_type: "azure-devops-user-story-created",
    client_payload: {
      workItemId: workItemId.toString(),
      title: fields["System.Title"] || "Untitled User Story",
      description: fields["System.Description"] || "",
      acceptanceCriteria:
        fields["Microsoft.VSTS.Common.AcceptanceCriteria"] || "",
      assignedTo: fields["System.AssignedTo"]?.displayName || "",
      url: workItemUrl,
    },
  };

  // Get GitHub token from environment variable
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO || "Rwiebenga/UserStoryAgent";

  if (!githubToken) {
    context.res = {
      status: 500,
      body: "GitHub token not configured",
    };
    return;
  }

  // Send to GitHub
  const https = require("https");
  const data = JSON.stringify(githubPayload);

  const options = {
    hostname: "api.github.com",
    port: 443,
    path: `/repos/${githubRepo}/dispatches`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Azure-DevOps-Webhook-Proxy",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        context.log(`GitHub API response: ${response.statusCode}`);

        if (response.statusCode === 204) {
          context.res = {
            status: 200,
            body: `Successfully triggered GitHub Actions for work item ${workItemId}`,
          };
        } else {
          context.res = {
            status: response.statusCode,
            body: `GitHub API error: ${responseData}`,
          };
        }
        resolve();
      });
    });

    request.on("error", (error) => {
      context.log.error("Error calling GitHub API:", error);
      context.res = {
        status: 500,
        body: `Error calling GitHub API: ${error.message}`,
      };
      resolve();
    });

    request.write(data);
    request.end();
  });
};
