#!/bin/bash

# OwnIt GitHub Deployment Script
# Run this after creating your GitHub repository

echo "🚀 OwnIt GitHub Deployment"
echo "=========================="
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Set remote URL
REPO_URL="https://github.com/${GITHUB_USERNAME}/OwnIt.git"

echo ""
echo "Setting up remote repository..."
git remote add origin $REPO_URL

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/${GITHUB_USERNAME}/OwnIt/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Wait 2-3 minutes"
echo "5. Your site will be live at:"
echo "   https://${GITHUB_USERNAME}.github.io/OwnIt/"
echo ""
echo "🎉 Done!"
