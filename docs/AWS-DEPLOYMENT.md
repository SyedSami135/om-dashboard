# Hosting OM Request Dashboard on AWS

Two main options: **AWS Amplify** (easiest, recommended) or **EC2** (full control).

---

## Option 1: AWS Amplify (recommended)

Amplify builds and runs your Next.js app (including API routes) and handles HTTPS.

### 1. Push your code to Git

- Create a repo on **GitHub**, **GitLab**, **Bitbucket**, or **AWS CodeCommit**.
- Push your project (without `node_modules`, `.env.local`, or `.next` — they’re in `.gitignore`).

### 2. Create an Amplify app

1. In **AWS Console** go to **Amplify** → **New app** → **Host web app**.
2. Connect your Git provider and select the repo and branch (e.g. `main`).
3. Amplify will detect Next.js. Use these build settings:

**Build spec** (Amplify can auto-detect; if not, add `amplify.yml` in the project root):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**'
      headers:
        - key: 'Cache-Control'
          value: 'no-cache'
```

For **Next.js SSR** on Amplify, use the **Next.js** environment (Amplify Gen 2 or “Managed” Next.js). If you see a “Next.js” framework option, choose it so Amplify runs `next build` and hosts the app + API routes correctly.

### 3. Set environment variables

In Amplify: **App settings** → **Environment variables** → add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | `postgresql://nysonian:PASSWORD@54.172.115.118:5432/erp_maindb` |
| `TABLE_SCHEMA` | `customer_support` |
| `TABLE_NAME` | `om_dashboard_ai` |
| `NEXT_PUBLIC_APP_URL` | `https://your-amplify-url.amplifyapp.com` (or your custom domain) |

After the first deploy, copy the app URL from Amplify and set `NEXT_PUBLIC_APP_URL` to that (or your custom domain) and redeploy if needed.

### 4. Deploy

Save and deploy. Amplify will run `npm ci` and `npm run build`, then host the app. Your API routes (e.g. `/api/returns`, `/api/filters`) will work on the same domain.

### 5. Custom domain (optional)

In Amplify: **Domain management** → add your domain (e.g. `om.yourcompany.com`). Use the provided CNAME or the Amplify-assigned URL. Then set `NEXT_PUBLIC_APP_URL` to that URL.

### 6. Database access

Your PostgreSQL is at `54.172.115.118`. Ensure:

- The DB allows **inbound** connections on port **5432** from the internet (or from Amplify’s IPs if you restrict by IP). Amplify runs in AWS; if your DB only allows certain IPs, you may need to allow the AWS region’s egress IPs or use a fixed outbound IP (e.g. NAT) and allow that.
- `DATABASE_URL` uses the correct password and is stored only in Amplify env vars (never committed).

---

## Option 2: EC2 (VM)

You get a Linux server and run Node/Next yourself.

### 1. Launch an EC2 instance

- **AMI**: Amazon Linux 2 or Ubuntu 22.04.
- **Instance type**: e.g. `t3.small` or `t3.micro` for light traffic.
- **Security group**: allow **22** (SSH), **80** (HTTP), **443** (HTTPS). Restrict SSH to your IP if possible.
- Create/store a key pair for SSH.

### 2. Connect and install Node

```bash
ssh -i your-key.pem ec2-user@<instance-public-ip>
```

**Amazon Linux 2:**

```bash
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v
```

**Ubuntu:**

```bash
sudo apt update && sudo apt install -y nodejs npm
# Or use nvm as above for Node 20
```

### 3. Clone and build your app

```bash
cd /home/ec2-user
git clone https://github.com/YOUR_USER/om-dashboard.git
cd om-dashboard
npm ci
npm run build
```

### 4. Environment variables

Create a production env file (do not commit it):

```bash
nano .env.production
```

Add:

```env
PORT=3000
DATABASE_URL=postgresql://nysonian:PASSWORD@54.172.115.118:5432/erp_maindb
TABLE_SCHEMA=customer_support
TABLE_NAME=om_dashboard_ai
NEXT_PUBLIC_APP_URL=http://<EC2-PUBLIC-IP>
```

Later replace `http://<EC2-PUBLIC-IP>` with your domain if you add one.

### 5. Run with PM2 (keeps app running)

```bash
sudo npm install -g pm2
pm2 start npm --name "om-dashboard" -- start
pm2 save
pm2 startup   # run the command it prints so PM2 starts on reboot
```

App will listen on port 3000.

### 6. Reverse proxy and HTTPS (optional but recommended)

Install Nginx and point it to Next:

```bash
# Amazon Linux 2
sudo amazon-linux-extras install nginx1 -y
# Ubuntu
sudo apt install nginx -y
```

Configure Nginx (e.g. `/etc/nginx/conf.d/om-dashboard.conf`):

```nginx
server {
    listen 80;
    server_name your-domain.com;   # or EC2 public IP for testing
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

Set `NEXT_PUBLIC_APP_URL` to `http://your-domain.com` or `https://your-domain.com` once you have SSL.

**HTTPS**: Use **Let’s Encrypt** (e.g. `certbot`) or put the EC2 behind **AWS Application Load Balancer** with an ACM certificate.

### 7. Database access

- EC2 must be able to reach `54.172.115.118:5432` (outbound allowed by default).
- Your PostgreSQL server must allow connections from the EC2 instance’s IP (or from anywhere if it’s open).

---

## Checklist for both options

- [ ] Code in Git (no `.env.local` or secrets in repo).
- [ ] `DATABASE_URL`, `TABLE_SCHEMA`, `TABLE_NAME` set in hosting env.
- [ ] `NEXT_PUBLIC_APP_URL` set to the final app URL (Amplify or EC2/domain).
- [ ] PostgreSQL allows connections from AWS (Amplify or EC2 IP/range).
- [ ] After deploy, open `NEXT_PUBLIC_APP_URL` and test filters, table, and edits (Status, OM Update, Designated OM agent).

---

## Quick comparison

| | Amplify | EC2 |
|--|--------|-----|
| Setup | Connect repo, set env, deploy | SSH, Node, PM2, optional Nginx |
| HTTPS | Built-in + custom domain | You add (e.g. Certbot or ALB) |
| Scaling | Managed | You scale (e.g. bigger instance / LB) |
| Cost | Pay per build + hosting | Pay for instance (and data transfer) |

For most teams, **Amplify** is the fastest way to host this Next.js app on AWS.
