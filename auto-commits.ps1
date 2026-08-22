# Auto-Commit Script
# Generates commits spread over a specified time period (Default: 100 commits over 1 hour)

param(
    [int]$CommitCount = 100,
    [double]$Hours = 1,
    [string]$Branch = "main",
    [string]$LogFile = "activity_log.txt"
)

$startDate = (Get-Date).AddHours(-$Hours)
$totalSeconds = $Hours * 3600
$dateIncrement = $totalSeconds / $CommitCount  # seconds between commits (36 seconds for 100 commits / 1 hr)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 Generating $CommitCount commits over $Hours hour(s)..." -ForegroundColor Cyan
Write-Host "📅 Start Time: $($startDate.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Yellow
Write-Host "📅 End Time:   $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Yellow
Write-Host "⏱️ Interval:   $([math]::Round($dateIncrement, 2)) seconds per commit" -ForegroundColor DarkCyan
Write-Host "==========================================" -ForegroundColor Cyan

for ($i = 1; $i -le $CommitCount; $i++) {
    $commitDate = $startDate.AddSeconds($dateIncrement * $i)
    $dateStr = $commitDate.ToString("yyyy-MM-dd HH:mm:ss")
    $message = "feat(checkpoint): auto commit $i of $CommitCount - $dateStr"
    
    # Update activity log file with timestamp entry
    Add-Content -Path $LogFile -Value "Checkpoint $i / $CommitCount recorded at $dateStr"
    
    # Set environment variables for author and committer dates before committing
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    # Stage and commit with backdated timestamp
    git add $LogFile
    git commit --date="$dateStr" -m "$message" --quiet
    
    $percent = [math]::Round(($i / $CommitCount) * 100)
    Write-Progress -Activity "Generating Commits" -Status "Commit $i of $CommitCount ($percent%)" -PercentComplete $percent
}

# Clean up environment variables
Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Done! Successfully generated $CommitCount commits spread across the last $Hours hour(s)." -ForegroundColor Green
Write-Host "💡 To push these commits to GitHub, run: git push origin $Branch" -ForegroundColor Yellow