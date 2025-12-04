# 🚀 Deploying OwnIt to GitHub Pages

## Prerequisites
Git command line tools are needed. Install them first.

## Quick Deployment Guide

### Option 1: GitHub Desktop (Recommended - Easy)

1. **Download GitHub Desktop**
   - Go to: https://desktop.github.com
   - Download and install
   - Sign in with your GitHub account

2. **Add Your Project**
   - Open GitHub Desktop
   - Click `File` → `Add Local Repository`
   - Choose folder: `/Users/isaiah/OwnIt`
   - Click "Add Repository"

3. **Publish to GitHub**
   - Click "Publish repository" button
   - Repository name: `OwnIt`
   - Description: `Voice-first professional social network with 2FA`
   - ✅ Keep "Public" checked
   - Click "Publish Repository"

4. **Enable GitHub Pages**
   - Go to: https://github.com/YOUR_USERNAME/OwnIt
   - Click `Settings` → `Pages` (left sidebar)
   - Source: Select `main` branch
   - Click `Save`
   - Wait 2-3 minutes
   - Your site: `https://YOUR_USERNAME.github.io/OwnIt/`

### Option 2: Install Git Tools & Use Terminal

1. **Install Git**
   ```bash
   # Check if git is installed
   git --version
   
   # If not installed, macOS will prompt to install Xcode Command Line Tools
   # Click "Install" and wait for completion
   ```

2. **Initialize Git Repository**
   ```bash
   cd /Users/isaiah/OwnIt
   git init
   git add .
   git commit -m "Complete OwnIt application with all features"
   ```

3. **Create GitHub Repository**
   - Go to: https://github.com/new
   - Repository name: `OwnIt`
   - Public ✅
   - Click "Create repository"

4. **Push to GitHub**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/OwnIt.git
   git push -u origin main
   ```

5. **Enable GitHub Pages**
   - Settings → Pages → Source: main → Save

### Option 3: Manual Upload (No Git)

1. **Create Zip File**
   ```bash
   cd /Users/isaiah
   zip -r OwnIt.zip OwnIt -x "*.DS_Store" -x "OwnIt/.git/*"
   ```

2. **Create GitHub Repo**
   - Go to: https://github.com/new
   - Name: `OwnIt`
   - Public ✅
   - ✅ Add README
   - Create

3. **Upload Files**
   - Click "Add file" → "Upload files"
   - Drag and drop all files from OwnIt folder
   - Commit changes

4. **Enable Pages**
   - Settings → Pages → main → Save

## Accessing Your Live Site

After GitHub Pages is enabled:
- URL: `https://YOUR_USERNAME.github.io/OwnIt/`
- Login page: `https://YOUR_USERNAME.github.io/OwnIt/auth.html`

## Notes

- First deployment takes 2-5 minutes
- Updates take ~1 minute to reflect
- Site is publicly accessible
- Free HTTPS included
- No server costs!

## Troubleshooting

**If pages doesn't work:**
1. Check Settings → Pages shows green checkmark
2. Verify branch is set to `main`
3. Clear browser cache
4. Wait a few more minutes

**To update your site later:**
- Just push new commits to GitHub
- Pages auto-deploys changes
