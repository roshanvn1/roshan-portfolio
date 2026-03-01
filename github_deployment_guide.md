# How to Deploy Your Portfolio to GitHub Pages

Congratulations! Your outstanding new portfolio is ready. Follow these step-by-step instructions to get it hosted for free on GitHub Pages and share it with the world.

### Step 1: Create a New GitHub Repository
1. Log in to your [GitHub Account](https://github.com/).
2. Click the `+` icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `roshan-portfolio` or `roshankn.github.io`).
4. Make sure it is set to **Public**.
5. Do **NOT** check "Initialize this repository with a README" (leave it empty).
6. Click **Create repository**.

### Step 2: Upload Your Website Files
Now you need to upload the files from your local computer (`d:\things_for backup\github website`) to this new repository. You can do this via Git Command Line OR simply via the GitHub web interface:

**Easiest Way (via Browser):**
1. On your new repository page, click the **"uploading an existing file"** link.
2. Drag and drop `index.html`, `style.css`, and `script.js` from the `github website` folder into the browser window.
3. Click **Commit changes** at the bottom.

**Geeky Way (via Git Command Line):**
1. Open PowerShell or Command Prompt.
2. Navigate to your folder: `cd "d:\things_for backup\github website"`
3. Run the following commands (replace `YOUR_USERNAME` and `REPO_NAME`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Add portfolio files"
   git branch -M main
   git remote add origin https://github.com/roshanvn1/roshan-portfolio
   git push -u origin main
   ```

### Step 3: Enable GitHub Pages
1. Go back to your repository page on GitHub.
2. Click on the ⚙️ **Settings** tab at the top.
3. In the left sidebar, scroll down and click on **Pages**.
4. Under "Build and deployment", set the **Source** to **Deploy from a branch**.
5. Under "Branch", select **main** (or **master**) from the dropdown, and leave the folder as `/ (root)`.
6. Click **Save**.

### Step 4: Wait and View Your Website
- GitHub will now start building your website. It may take 1 to 5 minutes.
- Refresh the page, and at the top of the GitHub Pages settings, you'll eventually see a message:
  🎉 **"Your site is live at https://YOUR_USERNAME.github.io/REPO_NAME/"**
- Click that link to view your beautifully designed portfolio online!

Now you can put this link directly on your LinkedIn profile (`www.linkedin.com/in/roshan-v-n/`) and your resume!
