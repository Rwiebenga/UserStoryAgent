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

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Set the following:
   - **Note:** "Azure DevOps PR Creator"
   - **Expiration:** Choose appropriate duration
   - **Scopes:** Check `repo` (Full control of private repositories)
4. Click "Generate token"
5. **IMPORTANT:** Copy the token immediately (you won't see it again)

### Step 2: Configure Azure DevOps Service Hook

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

- **URL:** `https://api.github.com/repos/RensWiebenga/FindMyEmbassyReact/dispatches`
- **HTTP Headers:**

  ```
  Accept: application/vnd.github+json
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  X-GitHub-Api-Version: 2022-11-28
  Content-Type: application/json
  ```

  Replace `YOUR_GITHUB_TOKEN_HERE` with the token from Step 1

- **HTTP Body (JSON):**

  ```json
  {
    "event_type": "azure-devops-user-story-created",
    "client_payload": {
      "workItemId": "{{workitem.id}}",
      "title": "{{workitem.fields['System.Title']}}",
      "description": "{{workitem.fields['System.Description']}}",
      "acceptanceCriteria": "{{workitem.fields['Microsoft.VSTS.Common.AcceptanceCriteria']}}",
      "assignedTo": "{{workitem.fields['System.AssignedTo']}}",
      "url": "{{workitem.url}}"
    }
  }
  ```

- **Resource details to send:** `All`
- **Messages to send:** `All`
- Click **Finish**

### Step 3: Test the Integration

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
2. Ensure the workflow file is on the `Develop` branch
3. Verify GitHub token has correct permissions

### Authentication errors

- Verify the GitHub token hasn't expired
- Ensure the token has `repo` scope
- Check the Authorization header format: `Bearer YOUR_TOKEN`

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
