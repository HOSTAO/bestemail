#!/bin/bash

# Replace all primary- color references with blue-
find src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | while read file; do
    sed -i '' 's/primary-50/blue-50/g' "$file"
    sed -i '' 's/primary-100/blue-100/g' "$file"
    sed -i '' 's/primary-200/blue-200/g' "$file"
    sed -i '' 's/primary-300/blue-300/g' "$file"
    sed -i '' 's/primary-400/blue-400/g' "$file"
    sed -i '' 's/primary-500/blue-500/g' "$file"
    sed -i '' 's/primary-600/blue-600/g' "$file"
    sed -i '' 's/primary-700/blue-700/g' "$file"
    sed -i '' 's/primary-800/blue-800/g' "$file"
    sed -i '' 's/primary-900/blue-900/g' "$file"
done

echo "Color replacements complete!"