$tokens = @()
if ($env:SUPABASE_ACCESS_TOKEN) {
    $tokens += $env:SUPABASE_ACCESS_TOKEN
}

$success = $false
foreach ($token in $tokens) {
    Write-Host "Trying token..."
    $headers = @{
        "Authorization" = "Bearer $token"
        "User-Agent" = "PowerShell"
    }
    try {
        $response = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects" -Headers $headers -Method Get -ErrorAction Stop
        $response | ConvertTo-Json -Depth 100 | Out-File -FilePath "projects.json" -Encoding utf8
        Write-Host "Success! Saved to projects.json"
        $success = $true
        break
    } catch {
        Write-Warning "Token failed: $_"
    }
}

if (-not $success) {
    @{ error = "All tokens failed" } | ConvertTo-Json | Out-File -FilePath "projects.json" -Encoding utf8
}
