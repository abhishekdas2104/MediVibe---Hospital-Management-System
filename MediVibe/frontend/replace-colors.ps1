# Color replacement script for warm palette
$files = Get-ChildItem -Path "$PSScriptRoot\src" -Recurse -Filter "*.jsx"
$replacementCount = 0

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw
  $originalContent = $content
  
  # Replace cyan with amber
  $content = $content -replace 'cyan-900', 'amber-900'
  $content = $content -replace 'cyan-800', 'amber-800'
  $content = $content -replace 'cyan-700', 'amber-700'
  $content = $content -replace 'cyan-600', 'amber-600'
  $content = $content -replace 'cyan-500', 'amber-500'
  $content = $content -replace 'cyan-400', 'amber-400'
  $content = $content -replace 'cyan-300', 'amber-300'
  $content = $content -replace 'cyan-200', 'amber-200'
  $content = $content -replace 'cyan-50', 'amber-50'
  
  # Replace blue with orange
  $content = $content -replace 'blue-900', 'orange-900'
  $content = $content -replace 'blue-800', 'orange-800'
  $content = $content -replace 'blue-700', 'orange-700'
  $content = $content -replace 'blue-600', 'orange-600'
  $content = $content -replace 'blue-500', 'orange-500'
  $content = $content -replace 'blue-400', 'orange-400'
  $content = $content -replace 'blue-300', 'orange-300'
  $content = $content -replace 'blue-200', 'orange-200'
  $content = $content -replace 'blue-50', 'orange-50'
  
  # Replace slate with stone
  $content = $content -replace 'slate-950', 'amber-950'
  $content = $content -replace 'slate-900', 'stone-900'
  $content = $content -replace 'slate-800', 'stone-800'
  $content = $content -replace 'slate-700', 'stone-700'
  $content = $content -replace 'slate-600', 'stone-600'
  $content = $content -replace 'slate-500', 'stone-500'
  $content = $content -replace 'slate-400', 'stone-400'
  $content = $content -replace 'slate-300', 'stone-300'
  $content = $content -replace 'slate-200', 'stone-200'
  $content = $content -replace 'slate-50', 'stone-50'
  
  # Replace emerald/teal with amber/orange
  $content = $content -replace 'emerald-900', 'amber-900'
  $content = $content -replace 'emerald-800', 'amber-800'
  $content = $content -replace 'emerald-700', 'amber-700'
  $content = $content -replace 'emerald-600', 'amber-600'
  $content = $content -replace 'emerald-500', 'amber-500'
  $content = $content -replace 'emerald-400', 'amber-400'
  $content = $content -replace 'emerald-300', 'amber-300'
  
  $content = $content -replace 'teal-900', 'orange-900'
  $content = $content -replace 'teal-800', 'orange-800'
  $content = $content -replace 'teal-700', 'orange-700'
  $content = $content -replace 'teal-600', 'orange-600'
  $content = $content -replace 'teal-500', 'amber-500'
  $content = $content -replace 'teal-400', 'amber-400'
  
  # Replace indigo/purple/pink with orange/amber
  $content = $content -replace 'indigo-500', 'orange-500'
  $content = $content -replace 'purple-500', 'orange-500'
  $content = $content -replace 'pink-500', 'orange-500'
  
  if ($content -ne $originalContent) {
    Set-Content -Path $file.FullName -Value $content -NoNewline
    $replacementCount++
    Write-Host "Updated: $($file.Name)"
  }
}

Write-Host "`nTotal files updated: $replacementCount out of $($files.Count)"
