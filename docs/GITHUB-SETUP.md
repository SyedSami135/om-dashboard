# Setting Up GitHub for OM Dashboard

Step-by-step guide to get your project on GitHub so you can deploy to AWS Amplify (or use it anywhere else).

---

## Step 1: Create a GitHub account

1. Go to **https://github.com**
2. Click **Sign up**
3. Enter your email, a password, and a username
4. Verify your email if GitHub asks you to

---

## Step 2: Install Git on your PC

Git is the tool that talks to GitHub from your computer.

1. Go to **https://git-scm.com/download/win**
2. Download **"Click here to download"** (64-bit Windows)
3. Run the installer — you can keep the default options (Next, Next)
4. When it asks about **PATH**, leave **"Git from the command line and also from 3rd-party software"** selected
5. Finish the install

**Check it worked:** Open **PowerShell** or **Command Prompt** and run:

```powershell
git --version
```

You should see something like `git version 2.43.0`.

---

## Step 3: Tell Git who you are (one-time)

Git needs your name and email for your commits. Use the **same email** as your GitHub account.

In PowerShell (or Command Prompt), run:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Replace with your real name and the email you used for GitHub.

---

## Step 4: Create a new repository on GitHub

1. Log in to **https://github.com**
2. Click the **+** (plus) at the top right → **New repository**
3. Fill in:
   - **Repository name:** `om-dashboard` (or any name you like)
   - **Description:** optional, e.g. "OM Request Dashboard"
   - **Public**
   - **Do not** check "Add a README file" (you already have a project)
4. Click **Create repository**

You’ll see a page with setup instructions. You’ll do the “push an existing repository” part in the next step.

---

## Step 5: Put your project under Git and push to GitHub

Open **PowerShell** and go to your project folder:

```powershell
cd "C:\Users\abdul\Desktop\OM Dashboard"
```

Then run these commands **one by one**:

**1. Turn this folder into a Git repo**

```powershell
git init
```

**2. Add all your files (except what’s in .gitignore)**

```powershell
git add .
```

**3. Make the first “save” (commit)**

```powershell
git commit -m "Initial commit - OM Request Dashboard"
```

**4. Rename the default branch to `main` (GitHub’s default)**

```powershell
git branch -M main
```

**5. Connect to your GitHub repo**

Replace `YOUR_USERNAME` with your GitHub username and `om-dashboard` with the repo name if you used something else:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/om-dashboard.git
```

**6. Push your code to GitHub**

```powershell
git push -u origin main
```

GitHub will ask you to **log in**:

- It may open a browser, or
- It may ask for **username** and **password**

**Important:** For the password, do **not** use your normal GitHub password. Use a **Personal Access Token**:

---

## Step 6: Create a Personal Access Token (for push “password”)

GitHub no longer accepts your account password for `git push`; you use a token instead.

1. On GitHub, click your **profile picture** (top right) → **Settings**
2. In the left sidebar, scroll to **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token** → **Generate new token (classic)**
4. Give it a name, e.g. **OM Dashboard**
5. Choose an expiration (e.g. 90 days or “No expiration” if you prefer)
6. Under **Scopes**, check **repo** (full control of private repositories)
7. Click **Generate token**
8. **Copy the token** and store it somewhere safe — you won’t see it again.

When you run `git push` and it asks for a password, **paste this token** (not your GitHub password).

---

## Step 7: Verify it worked

1. Go to **https://github.com/YOUR_USERNAME/om-dashboard**
2. You should see your project files (e.g. `app`, `components`, `package.json`, etc.)
3. You should **not** see:
   - `node_modules`
   - `.env.local`
   - `.next`

Those are ignored by `.gitignore`, which is correct.

---

## Later: Making changes and pushing again

After you change code and want to update GitHub:

```powershell
cd "C:\Users\abdul\Desktop\OM Dashboard"
git add .
git commit -m "Describe what you changed"
git push
```

Use a short description in place of `"Describe what you changed"` (e.g. `"Add filter for status"`).

---

## Quick reference

| Goal              | Command |
|-------------------|--------|
| See status        | `git status` |
| Add all changes   | `git add .` |
| Commit            | `git commit -m "Your message"` |
| Push to GitHub    | `git push` |
| Pull from GitHub  | `git pull` |

---

## Troubleshooting

**“git is not recognized”**  
- Install Git (Step 2) and **close and reopen** PowerShell.

**“Permission denied” or “Authentication failed” on push**  
- Use a **Personal Access Token** as the password (Step 6), not your GitHub password.

**“Support for password authentication was removed”**  
- Same as above: use a token, not your account password.

**Wrong repo or URL**  
- Check: `git remote -v`  
- Fix: `git remote set-url origin https://github.com/YOUR_USERNAME/om-dashboard.git`

Once this is done, you can connect this GitHub repo to **AWS Amplify** using the steps in **AWS-DEPLOYMENT.md**.
