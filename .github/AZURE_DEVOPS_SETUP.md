# Azure DevOps to GitHub PR Automation Setup Guide

This guide explains how to set up automatic pull request creation in GitHub when a Product Owner creates a user story in Azure DevOps.

## 🎯 Overview

**Workflow:**

1. Product Owner creates a User Story in Azure DevOps
2. Azure DevOps Service Hook triggers GitHub Actions
3. GitHub Actions creates a feature branch
4. GitHub Actions creates a Pull Request for engineer review

---

## 📋 Prerequisites

- Azure DevOps project with access to Service Hooks
- GitHub repository (RensWiebenga/FindMyEmbassyReact)
- GitHub Personal Access Token with `repo` scope

---

## 🔧 Setup Instructions

### Step 1: Create GitHub Personal Access Token

#### Detailed Instructions:

**Option A: Using Fine-grained Personal Access Tokens (Recommended - New Method)**

1. **Navigate to GitHub Settings**

   - Go to [github.com](https://github.com) and make sure you're logged in
   - Click your profile picture in the top-right corner
   - Click **Settings** from the dropdown menu

2. **Access Developer Settings**

   - Scroll all the way down the left sidebar
   - Click **Developer settings** (second to last option, above Copilot)

3. **Go to Personal Access Tokens**

   - In the left sidebar, expand **Personal access tokens**
   - Click **Fine-grained tokens** (this is the newer, more secure option)

4. **Generate New Token**

   - Click the **Generate new token** button (green button in top-right)
   - You may be prompted to confirm your password - enter it

5. **Configure Token Settings**

   - **Token name:** `Azure DevOps PR Automation`
   - **Expiration:** Select your preference (30, 60, 90 days, or Custom)
     - Recommended: 90 days (you'll need to regenerate it after expiration)
   - **Description:** `Allows Azure DevOps to create PRs automatically`
   - **Resource owner:** Select `RensWiebenga` (the repository owner)

6. **Set Repository Access**

   - Under **Repository access**, select **Only select repositories**
   - Click the **Select repositories** dropdown
   - Search for and select `FindMyEmbassyReact`

7. **Configure Permissions**

   - Scroll down to **Permissions** → **Repository permissions**
   - Find and expand **Contents**
     - Set to: **Read and write** (allows creating branches and files)
   - Find and expand **Pull requests**
     - Set to: **Read and write** (allows creating and managing PRs)
   - Find and expand **Metadata**
     - This will be automatically set to **Read-only** (required)
   - Find and expand **Workflows** (optional, but recommended)
     - Set to: **Read and write** (allows triggering GitHub Actions)

8. **Generate the Token**
   - Scroll to the bottom and click **Generate token** (green button)
   - **CRITICAL:** Copy the token immediately - it looks like `github_pat_11A...`
   - Store it securely (you won't be able to see it again!)
   - Consider saving it temporarily in a secure note or password manager

---

**Option B: Using Classic Personal Access Tokens (Legacy Method)**

If you prefer the older method or can't find fine-grained tokens:

1. **Navigate to GitHub Settings**

   - Go to [github.com](https://github.com)
   - Click your profile picture → **Settings**

2. **Access Developer Settings**

   - Scroll down and click **Developer settings**

3. **Go to Personal Access Tokens**

   - Click **Personal access tokens**
   - Click **Tokens (classic)**

4. **Generate New Token**

   - Click **Generate new token (classic)**
   - You may need to enter your password

5. **Configure Token**

   - **Note:** `Azure DevOps PR Creator`
   - **Expiration:** Select duration (30, 60, 90 days, or Custom)
   - **Select scopes:** Check the **`repo`** checkbox (this gives full control of private repositories)
     - This will automatically select all sub-scopes under `repo`

6. **Generate and Copy**
   - Scroll down and click **Generate token**
   - **IMPORTANT:** Copy the token immediately (looks like `ghp_xxxxxxxxxxxx`)
   - Save it securely!

---

#### Troubleshooting Token Creation:

**Can't find Developer Settings?**

- Make sure you're on github.com (not gist.github.com or docs.github.com)
- Try this direct link: [https://github.com/settings/tokens](https://github.com/settings/tokens)

**Don't see Personal Access Tokens option?**

- Ensure your GitHub account has the necessary permissions
- Your organization may have restrictions - contact your GitHub admin

**Token expires too quickly?**

- GitHub recommends shorter expiration for security
- You can set up a calendar reminder to regenerate the token before it expires
- Consider using GitHub Apps for long-term automation (more advanced)

**Lost your token?**

- You cannot recover a lost token
- Simply generate a new one and update the Azure DevOps Service Hook configuration

### Step 2: Deploy Azure Function Webhook Proxy

Since Azure DevOps Service Hooks doesn't allow custom JSON payloads for the GitHub `/dispatches` endpoint, we need to use a simple Azure Function as a proxy that converts Azure DevOps webhooks into GitHub repository_dispatch events.

#### Option A: Quick Deploy to Azure (Recommended)

1. **Create an Azure Function App:**

   - Go to [Azure Portal](https://portal.azure.com)
   - Click **Create a resource** → **Function App**
   - Fill in the details:
     - **Function App name:** `azuredevops-github-proxy` (must be globally unique)
     - **Runtime stack:** Node.js
     - **Version:** 18 LTS or higher
     - **Region:** Choose closest to you
   - Click **Review + create** → **Create**

2. **Configure Function App Settings:**

   - After deployment, go to your Function App
   - In the left menu, click **Configuration**
   - Under **Application settings**, click **New application setting**
   - Add these two settings:
     - Name: `GITHUB_TOKEN`, Value: Your GitHub token from Step 1
     - Name: `GITHUB_REPO`, Value: `Rwiebenga/UserStoryAgent`
   - Click **Save**

3. **Deploy the Function Code:**
   - In your Function App, click **Functions** in the left menu
   - Click **Create** → **HTTP trigger**
   - Name: `AzureDevOpsWebhook`
   - Authorization level: **Function**
   - Click **Create**
4. **Add the Function Code:**

   - Click on your new function
   - Click **Code + Test** in the left menu
   - Replace the content of `index.js` with the code from `.azure-function/index.js` in this repository
   - Click **Save**

5. **Get the Function URL:**
   - Click **Get Function URL** button
   - Copy the URL (it will look like: `https://azuredevops-github-proxy.azurewebsites.net/api/AzureDevOpsWebhook?code=...`)
   - **Save this URL** - you'll need it for Step 3

#### Option B: Use GitHub Actions Workflow Dispatch (Simpler Alternative)

If you don't want to set up an Azure Function, you can manually trigger the workflow:

1. The workflow has been updated to support both `repository_dispatch` and `workflow_dispatch`
2. You can manually trigger it from GitHub Actions tab
3. For full automation, Option A (Azure Function) is still recommended

---

### Step 3: Configure Azure DevOps Service Hook

1. Go to your Azure DevOps project
2. Navigate to **Project Settings** (bottom left)
3. Under "General", click **Service Hooks**
4. Click **Create subscription** (green + button)
5. Select **Web Hooks** and click **Next**

#### Configure Trigger:

- **Trigger on this type of event:** `Work item created`
- **Filters:**
  - Work item type: `User Story`
  - Area path: (leave as "Any" or specify your area)
- Click **Next**

#### Configure Action:

- **URL:** Paste your Azure Function URL from Step 2 (Option A)

  - Example: `https://azuredevops-github-proxy.azurewebsites.net/api/AzureDevOpsWebhook?code=YOUR_FUNCTION_KEY`

- **HTTP Headers:** Leave this field **EMPTY**

- **☑ Accept untrusted SSL certificates:** Leave unchecked

- **Basic authentication username:** Leave empty (authentication is handled by the function code parameter)

- **Basic authentication password:** Leave empty

- **Resource details to send:** `All`
- **Messages to send:** `All`
- **Detailed messages to send:** `All`
- Click **Test** to verify the connection
- If successful, click **Finish**

---

### Step 4: Test the Integration

1. In Azure DevOps, create a new User Story:

   - Title: "Test automated PR creation"
   - Description: Add a brief description
   - Acceptance Criteria: Add test criteria
   - Assign to an engineer (optional)

2. Within a few seconds:

   - Check GitHub Actions (Actions tab) - you should see the workflow running
   - A new branch `feature/US-{ID}` will be created
   - A Pull Request will be created targeting `Develop` branch

3. Verify the PR contains:
   - User story title and ID
   - Link back to Azure DevOps
   - Acceptance criteria
   - Engineer checklist

---

## 🔍 Troubleshooting

### Service Hook not triggering

1. Go to Azure DevOps → Project Settings → Service Hooks
2. Click on your hook → **History** tab
3. Check for failed attempts and error messages

### GitHub Actions not running

1. Check GitHub → Actions tab for workflow runs
2. Ensure the workflow file is on the `main` branch (or your default branch)
3. Verify GitHub token has correct permissions
4. Check Azure Function logs if using Option A in Step 2

### Azure Function errors (if using Option A)

1. Go to Azure Portal → Your Function App → Monitor
2. Check the **Logs** tab for errors
3. Verify the GITHUB_TOKEN environment variable is set correctly
4. Ensure the function code was deployed correctly

### Authentication errors

- Verify the GitHub token hasn't expired
- Ensure the token has proper permissions (Contents: Read/Write, Pull Requests: Read/Write)
- Check that the token is configured correctly in Azure Function settings

### Branch creation fails

- Ensure the GitHub token can write to the repository
- Check that the base branch (`Develop`) exists
- Verify no branch with the same name already exists

---

## 📝 User Story Format Recommendations

For best results, Product Owners should structure User Stories as follows:

**Title:**

```
As a [user type], I want [goal] so that [benefit]
```

**Description:**

```
Detailed explanation of the feature or requirement
Include context, background, and any relevant information
```

**Acceptance Criteria:**

```
- [ ] Criterion 1: Specific, measurable outcome
- [ ] Criterion 2: Another measurable outcome
- [ ] Criterion 3: Edge cases covered
```

---

## 🔄 Workflow Details

### What Happens Automatically:

1. **Feature Branch Created:**

   - Name: `feature/US-{WorkItemId}`
   - Base: `Develop` branch
   - Contains: Initial markdown file with user story details

2. **Pull Request Created:**

   - Title: `US-{ID}: {User Story Title}`
   - Labels: `user-story`, `azure-devops`
   - Assignee: Assigned engineer from Azure DevOps
   - Base: `Develop` branch

3. **PR Contents:**
   - Link to Azure DevOps work item
   - Full user story description
   - Acceptance criteria checklist
   - Engineer review checklist
   - Automated comment with instructions

### What Engineers Need to Do:

1. Review the user story in Azure DevOps
2. Checkout the feature branch locally
3. Implement the feature
4. Push commits to the branch
5. Ensure all acceptance criteria are met
6. Request code review
7. After approval, merge to Develop
8. Update Azure DevOps work item status

---

## 🎨 Customization

### Modify Branch Naming:

Edit `.github/workflows/create-pr-from-user-story.yml`:

```yaml
BRANCH_NAME="feature/US-${{ github.event.client_payload.workItemId }}"
```

Change to your preferred format (e.g., `feat/`, `story/`, etc.)

### Change Target Branch:

```yaml
--base Develop
```

Change `Develop` to `main`, `master`, or your default branch

### Add Custom Labels:

```yaml
--label "user-story,azure-devops"
```

Add additional labels as needed

### Modify PR Template:

Edit the PR_BODY section in the workflow file to customize the PR description

---

## 🔒 Security Notes

- **Never commit GitHub tokens to the repository**
- Store tokens securely in Azure DevOps or GitHub Secrets
- Rotate tokens periodically
- Use minimal required permissions
- Review Service Hook history regularly

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure DevOps Service Hooks](https://learn.microsoft.com/en-us/azure/devops/service-hooks/)
- [GitHub API - Repository Dispatch](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event)

---

## ✅ Success Checklist

- [ ] GitHub Personal Access Token created and saved securely
- [ ] Azure DevOps Service Hook configured and tested
- [ ] GitHub Actions workflow file committed to repository
- [ ] Test user story created and PR generated successfully
- [ ] Team trained on the new workflow
- [ ] Documentation shared with Product Owners and Engineers

---

**Questions or Issues?**
Contact your DevOps team or create an issue in this repository.
