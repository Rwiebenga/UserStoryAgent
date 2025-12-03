# Azure DevOps to GitHub PR Trigger Script
# This script is called by Azure DevOps Service Hooks to trigger GitHub Actions

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$true)]
    [string]$WorkItemId,
    
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "",
    
    [Parameter(Mandatory=$false)]
    [string]$AcceptanceCriteria = "",
    
    [Parameter(Mandatory=$false)]
    [string]$AssignedTo = "",
    
    [Parameter(Mandatory=$false)]
    [string]$WorkItemUrl = ""
)

# GitHub repository details
$GitHubOwner = "RensWiebenga"
$GitHubRepo = "FindMyEmbassyReact"

# Prepare the payload
$payload = @{
    event_type = "azure-devops-user-story-created"
    client_payload = @{
        workItemId = $WorkItemId
        title = $Title
        description = $Description
        acceptanceCriteria = $AcceptanceCriteria
        assignedTo = $AssignedTo
        url = $WorkItemUrl
    }
} | ConvertTo-Json -Depth 10

# Trigger GitHub Actions via repository_dispatch
$uri = "https://api.github.com/repos/$GitHubOwner/$GitHubRepo/dispatches"

$headers = @{
    "Accept" = "application/vnd.github+json"
    "Authorization" = "Bearer $GitHubToken"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    Write-Host "Triggering GitHub Actions workflow for Work Item #$WorkItemId..."
    Write-Host "Title: $Title"
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $payload -ContentType "application/json"
    
    Write-Host "✅ Successfully triggered PR creation workflow!" -ForegroundColor Green
    Write-Host "A pull request will be created shortly on GitHub."
    
    return @{
        Success = $true
        Message = "PR creation triggered successfully"
    }
}
catch {
    Write-Host "❌ Failed to trigger GitHub Actions: $($_.Exception.Message)" -ForegroundColor Red
    return @{
        Success = $false
        Message = $_.Exception.Message
    }
}
