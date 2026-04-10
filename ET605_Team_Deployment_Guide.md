# ET605 Course Project — Team Deployment & Integration Guide

## Server Infrastructure for Mathematics Chapter Websites

**Prepared by:** Merge Team (Kaushik, Khushi, Kabir)  
**Server Domain:** kaushik-dev.online  
**Portal URL:** https://kaushik-dev.online  
**Date:** April 2026

---

## 1. What We Are Providing You

Each team receives a **fully isolated Linux server** (Ubuntu 22.04) running inside a container on our central server. Think of it as your own private virtual machine where you have full control.

**You will receive:**

- A **.pem file** — this is your private SSH key to log into your server. Guard it carefully. If you lose it or share it publicly, anyone can access your server.
- **Your credentials** — username, SSH hostname, app port, and your live URL.
- **A live HTTPS URL** — your website will be accessible from anywhere in the world at `https://your-container-name.kaushik-dev.online`.
- **Full root (sudo) access** — you can install any software, database, or framework you need.
- **Isolated environment** — no other team can see or access your files, database, or processes.

**You do NOT get:**

- Access to the host machine or any other team's container.
- Ability to change your SSH port or app port — these are fixed.

---

## 2. Your Team Credentials

Each team receives a credentials sheet. Here is what each field means:

| Field | Meaning | Example |
|-------|---------|---------|
| Team | Your team name | AMA |
| Topic | The math chapter you are building | Grade 6 Fractions |
| Container | Your server's container name | grade6-fractions |
| Username | Your login username | grade6_fractions |
| App Port | The port your app MUST listen on | 3002 |
| Key File | Your private key file name | grade6-fractions.pem |
| SSH Hostname | The hostname for SSH access | ssh-g6-fractions.kaushik-dev.online |
| App URL | Where your website will be live | https://grade6-fractions.kaushik-dev.online |

### Complete Team → SSH Hostname Mapping

| Team | Container | Username | App Port | SSH Hostname |
|------|-----------|----------|----------|-------------|
| CogniPath | grade6-data-handling-and-presentation | grade6_data_handling | 3001 | ssh-g6-data-handling.kaushik-dev.online |
| AMA | grade6-fractions | grade6_fractions | 3002 | ssh-g6-fractions.kaushik-dev.online |
| Civilized | grade6-lines-angles-and-constructions | grade6_lines_angles | 3003 | ssh-g6-lines-angles.kaushik-dev.online |
| GroupName | grade6-number-play | grade6_number_play | 3004 | ssh-g6-number-play.kaushik-dev.online |
| The Alchemists | grade6-patterns-in-mathematics | grade6_patterns_math | 3005 | ssh-g6-patterns.kaushik-dev.online |
| GAP | grade6-perimeter-and-area | grade6_perimeter_area | 3006 | ssh-g6-perimeter.kaushik-dev.online |
| Asil & Kamal | grade6-prime-time | grade6_prime_time | 3007 | ssh-g6-prime-time.kaushik-dev.online |
| To be decided | grade6-symmetry | grade6_symmetry | 3008 | ssh-g6-symmetry.kaushik-dev.online |
| NTNU | grade6-the-other-side-of-zero | grade6_other_side_zero | 3009 | ssh-g6-other-side-zero.kaushik-dev.online |
| Electrify | grade8-algebraic-expr-and-factorisation | grade8_algebraic_expr | 3010 | ssh-g8-algebraic.kaushik-dev.online |
| j-familia | grade8-comparing-qty-and-proportions | grade8_comparing_qty | 3011 | ssh-g8-comparing.kaushik-dev.online |
| Learnlytics | grade8-data-handling | grade8_data_handling | 3012 | ssh-g8-data-handling.kaushik-dev.online |
| AdaptIQ | grade8-exponents-and-powers | grade8_exponents | 3013 | ssh-g8-exponents.kaushik-dev.online |
| GIFT | grade8-linear-equations-one-variable | grade8_linear_eq | 3015 | ssh-g8-linear-eq.kaushik-dev.online |
| Triple A's | grade8-mensuration | grade8_mensuration | 3016 | ssh-g8-mensuration.kaushik-dev.online |
| We Gooogled It | grade8-rational-numbers | grade8_rational_num | 3017 | ssh-g8-rational.kaushik-dev.online |
| 18_Forever | grade8-squares-roots-cubes-roots | grade8_squares_cubes | 3018 | ssh-g8-squares-cubes.kaushik-dev.online |
| Need_AA | grade8-understanding-quadrilaterals | grade8_quadrilaterals | 3019 | ssh-g8-quadrilaterals.kaushik-dev.online |

---

## 3. How to Connect to Your Server (SSH)

SSH access goes through a Cloudflare tunnel, so you can connect **from anywhere** — college, home, anywhere with internet. You need to install a small tool called `cloudflared` on your machine first.

### 3.1 — Install cloudflared (one-time setup)

**macOS:**
```bash
brew install cloudflared
```

**Windows (PowerShell as Administrator):**
```powershell
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi" -OutFile "$HOME\Downloads\cloudflared.msi"
Start-Process "$HOME\Downloads\cloudflared.msi"
```
After installing, close and reopen PowerShell.

**Linux (Ubuntu/Debian):**
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

Verify installation:
```bash
cloudflared --version
```

### 3.2 — Set .pem file permissions

**macOS / Linux / WSL:**
```bash
chmod 600 your-key-file.pem
```

**Windows PowerShell:**
```powershell
icacls your-key-file.pem /inheritance:r /grant:r "%USERNAME%:R"
```

### 3.3 — SSH into your container

The SSH command format is:

```bash
ssh -o ProxyCommand="cloudflared access ssh --hostname YOUR_SSH_HOSTNAME" -i YOUR_KEY_FILE.pem YOUR_USERNAME@YOUR_SSH_HOSTNAME
```

**Example for Team AMA (Grade 6 Fractions):**

```bash
ssh -o ProxyCommand="cloudflared access ssh --hostname ssh-g6-fractions.kaushik-dev.online" -i grade6-fractions.pem grade6_fractions@ssh-g6-fractions.kaushik-dev.online
```

The first time you connect, it will ask "Are you sure you want to continue connecting?" — type `yes` and press Enter.

### 3.4 — Verify You Are Connected

Once logged in, you should see a prompt like:

```
grade6_fractions@grade6-fractions:~$
```

You are now inside your own private server. You have full control.

---

## 4. How to Deploy Your Application

### 4.1 — The Key Rule

**YOUR APP MUST LISTEN ON YOUR DESIGNATED APP PORT**, bound to `0.0.0.0` (not `localhost` or `127.0.0.1`).

If your app port is 3002, your app must start a web server on port 3002. If it listens on any other port, your website will NOT be accessible from the outside.

### 4.2 — Step-by-Step Deployment

**Step 1: SSH into your server** (see Section 3.3)

**Step 2: Install your tech stack**

```bash
sudo apt update
```

For Node.js (recommended — install version 20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

For Python:
```bash
sudo apt install -y python3 python3-pip python3-venv
```

For Java:
```bash
sudo apt install -y default-jdk
```

For databases:
```bash
sudo apt install -y mongodb       # MongoDB
sudo apt install -y mysql-server  # MySQL
sudo apt install -y postgresql    # PostgreSQL
```

Install whatever your project needs — it's your server.

**Step 3: Clone your project**

```bash
git clone https://github.com/your-team/your-project.git
cd your-project
```

For private repos:
```bash
git clone https://YOUR_PERSONAL_ACCESS_TOKEN@github.com/your-team/your-project.git
```

**Step 4: Install dependencies**

```bash
npm install                            # Node.js
pip3 install -r requirements.txt       # Python
```

**Step 5: Configure your app to listen on the correct port**

Node.js (Express) — if your app port is 3002:
```javascript
const PORT = 3002;  // YOUR designated app port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

Python (Flask) — if your app port is 3002:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)  # YOUR designated app port
```

Python (Django):
```bash
python3 manage.py runserver 0.0.0.0:3002
```

Java (Spring Boot) — in `application.properties`:
```
server.port=3002
server.address=0.0.0.0
```

**Step 6: Test your app**

Run it once to make sure it starts without errors:
```bash
node server.js        # Node.js
python3 app.py        # Python
```

Then check if your website loads at `https://your-container-name.kaushik-dev.online`. If it does, stop the app (Ctrl+C) and move to Step 7 to make it permanent.

**Step 7: Keep your app running permanently (IMPORTANT)**

If you close your SSH session, your app stops. You need a process manager to keep it running. Install and use **pm2**:

```bash
# Install pm2
sudo npm install -g pm2

# Start your app with pm2
pm2 start server.js --name "my-app"                          # Node.js
pm2 start app.py --interpreter python3 --name "my-app"       # Python
pm2 start "python3 manage.py runserver 0.0.0.0:3002" --name "my-app"  # Django

# CRITICAL — run both of these so your app survives reboots:
pm2 save
pm2 startup
# If pm2 startup prints a sudo command, copy and run that command too
```

Now you can close SSH. Your app keeps running.

**Step 8: Verify your website is live**

Open a browser on your phone or any device and visit:

```
https://your-container-name.kaushik-dev.online
```

You should see your website.

---

## 5. pm2 Quick Reference (To keep the website running even if you exit your ssh session IMP)

```bash
pm2 status                # Check if your app is running
pm2 logs                  # View app logs (live)
pm2 logs --lines 50       # View last 50 lines
pm2 restart my-app        # Restart your app
pm2 stop my-app           # Stop your app
pm2 delete my-app         # Remove from pm2
pm2 start server.js --name "my-app"  # Start again
pm2 save                  # Save current state (do this after any change)
```

---

## 6. Frontend + Backend on a Single Port

Your container has **ONE port** exposed to the outside world. If you have both a frontend and a backend, you must serve them through that single port.

### Recommended: Single server serves everything

```javascript
const express = require('express');
const path = require('path');
const app = express();

// API routes (your backend)
app.post('/api/quiz', (req, res) => {
  res.json({ question: "What is 2+2?", options: [3, 4, 5, 6] });
});

app.post('/api/submit', (req, res) => {
  res.json({ score: 85 });
});

// Serve frontend build files
app.use(express.static(path.join(__dirname, 'client/build')));

// React SPA fallback — all other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// YOUR designated port
app.listen(3002, '0.0.0.0');
```

For deployment, build your React app first:
```bash
cd client
npm run build    # Creates client/build/ with static files
cd ..
pm2 restart my-app
```

---

## 7. How the Student Flow Works (READ THIS CAREFULLY)

### 7.1 — The Complete Student Journey

```
1. Student visits https://kaushik-dev.online (our Merge portal)
2. Student registers and logs in → receives a JWT token
3. Student sees the chapter dashboard with all chapters listed
4. Student clicks on your chapter
5. Our portal REDIRECTS the student to YOUR website with auth info in the URL:

   https://your-container.kaushik-dev.online/chapter
     ?token=<jwt_access_token>
     &student_id=STD-42
     &session_id=sess_abc123

6. YOUR app extracts token, student_id, and session_id from the URL
7. Student completes your chapter (quiz, exercises, etc.)
8. YOUR app sends a POST request to our Recommendation API with session data
9. Our API returns a recommendation (what the student should do next)
10. You display the recommendation to the student
```

### 7.2 — Extracting Session Info from the Redirect URL (REQUIRED)

<span style="color: red"> DON'T USE YOUR OWN AUTHENTICATION, USE OURS ONE TIME AUTH SETUP </span>

When we redirect a student to your chapter, the URL contains three critical pieces of information. You **MUST** extract and use all three.

**The redirect URL format:**
```
https://your-site.kaushik-dev.online/chapter?token=<jwt>&student_id=STD-42&session_id=sess_abc123
```

| Parameter | What it is | What you do with it |
|-----------|-----------|-------------------|
| `token` | JWT access token from our auth system | Include in the `Authorization: Bearer <token>` header when calling our API |
| `student_id` | Unique student identifier (e.g., `STD-42`) | Include in the recommendation payload — do NOT let students type this manually |
| `session_id` | Unique session identifier we generate | Include in the recommendation payload — do NOT generate your own |

**JavaScript — Extract and save:**

```javascript
// This runs on your chapter page when the student arrives
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const student_id = params.get("student_id");
const session_id = params.get("session_id");

// Save these — you'll need them throughout the session and when calling our API
sessionStorage.setItem("token", token);
sessionStorage.setItem("student_id", student_id);
sessionStorage.setItem("session_id", session_id);
```

**Python (Flask) — Extract and save:**

```python
from flask import request, session

@app.route('/chapter')
def chapter():
    token = request.args.get('token')
    student_id = request.args.get('student_id')
    session_id = request.args.get('session_id')

    # Save in Flask session for later use
    session['token'] = token
    session['student_id'] = student_id
    session['session_id'] = session_id

    return render_template('chapter.html')
```

### 7.3 — Decoding the JWT Token (optional but useful)

You can decode the JWT to get additional user info:

```javascript
// Install: npm install jwt-decode
import { jwtDecode } from "jwt-decode";

const user = jwtDecode(token);
// user.user_id    → 42 (Django user primary key)
// user.username   → "alice"
// user.student_id → "STD-42"
// user.exp        → token expiry timestamp
```

> **Note:** `jwtDecode` only reads the payload — it does not verify the signature. For full verification, use `jsonwebtoken` with the shared secret.

---

## 8. Calling the Recommendation API (REQUIRED)

After a student completes your chapter (or exits midway), your app **MUST** send a session payload to our Recommendation API.

### 8.1 — API Endpoint

```
POST https://kaushik-dev.online/api/recommend/
Content-Type: application/json
Authorization: Bearer <token_from_redirect_url>
```

### 8.2 — Request Payload

**ALL fields are required.** Do not omit any field.

```json
{
  "student_id":              "STD-42",
  "session_id":              "sess_abc123",
  "chapter_id":              "grade6_fractions",
  "timestamp":               "2026-04-04T10:30:00Z",
  "session_status":          "completed",
  "correct_answers":         8,
  "wrong_answers":           2,
  "questions_attempted":     10,
  "total_questions":         15,
  "retry_count":             3,
  "hints_used":              2,
  "total_hints_embedded":    10,
  "time_spent_seconds":      1200,
  "topic_completion_ratio":  0.67
}
```

### 8.3 — Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `student_id` | String | From the redirect URL. Never let students type this. |
| `session_id` | String | From the redirect URL. Use this exact value, do NOT generate your own. |
| `chapter_id` | String | Your canonical chapter_id (e.g., `grade6_fractions`). Must match exactly what was assigned to you. |
| `timestamp` | String | UTC ISO 8601 format. Example: `2026-04-04T10:30:00Z` |
| `session_status` | String | Either `"completed"` or `"exited_midway"`. |
| `correct_answers` | Integer | Number of correctly answered questions. |
| `wrong_answers` | Integer | Number of incorrectly answered questions. |
| `questions_attempted` | Integer | Unique questions the student attempted at least once. |
| `total_questions` | Integer | Total questions in your chapter (including unattempted). |
| `retry_count` | Integer | Number of re-attempts after first submission on a question. |
| `hints_used` | Integer | Number of hints the student actually opened/consumed. |
| `total_hints_embedded` | Integer | Total hints available in your chapter. |
| `time_spent_seconds` | Integer | Active time spent by the student. Exclude long idle periods if possible. |
| `topic_completion_ratio` | Number | Between 0 and 1. Completed learning units divided by total learning units. |

### 8.4 — Validation Rules

Enforce these **before** sending the payload. Our server will reject invalid data.

```
correct_answers + wrong_answers == questions_attempted
questions_attempted <= total_questions
retry_count <= questions_attempted
hints_used <= total_hints_embedded
0 <= topic_completion_ratio <= 1

If session_status == "completed" → questions_attempted must equal total_questions
```

### 8.5 — Response You Will Receive

```json
{
  "student_id": "STD-42",
  "chapter_id": "grade6_fractions",
  "performance_score": 0.72,
  "confidence_score": 0.85,
  "learning_state": "strong",
  "diagnosis": {
    "accuracy": 0.80,
    "hint_dependency": "low",
    "retry_behavior": "moderate",
    "time_efficiency": "moderate",
    "history": {
      "past_attempts": 1,
      "avg_performance": 0.72,
      "trend": "new"
    }
  },
  "recommendation": {
    "type": "next_chapter",
    "reason": "Strong performance with good accuracy. Ready to advance.",
    "next_steps": [
      "Proceed to Grade 6 Number Play",
      "Review hint-dependent topics if needed"
    ]
  }
}
When a student's performance is weak, the recommendation.type will be "prerequisite" and the response will include a prerequisite_url field pointing to the chapter they should revisit:


{
  "student_id": "STD-42",
  "chapter_id": "grade6_fractions",
  "performance_score": 0.31,
  "confidence_score": 0.48,
  "learning_state": "weak",
  "diagnosis": {
    "accuracy": 0.30,
    "hint_dependency": "high",
    "retry_behavior": "high",
    "time_efficiency": "low",
    "history": {
      "past_attempts": 0,
      "trend": "new"
    }
  },
  "recommendation": {
    "type": "prerequisite",
    "reason": "Low performance indicates foundational gaps.",
    "next_steps": [
      "Revisit prerequisite chapter: grade5_fractions",
      "Complete guided revision before retrying this chapter."
    ],
    "prerequisite_url": "https://grade6-fractions.kaushik-dev.online"
  }
}
```
Note: prerequisite_url is only present when recommendation.type === "prerequisite" and the prerequisite chapter is hosted on our server. Always check for its existence before using it.

Display this recommendation to the student so they know what to do next.
### 8.6 — Complete Code Examples

**Node.js (Express) — Full integration:**

```javascript
const axios = require('axios');

async function submitSessionToMerge() {
  // Retrieve saved values from sessionStorage
  const token = sessionStorage.getItem("token");
  const student_id = sessionStorage.getItem("student_id");
  const session_id = sessionStorage.getItem("session_id");

  const payload = {
    student_id: student_id,
    session_id: session_id,
    chapter_id: "grade6_fractions",              // YOUR chapter_id — replace with yours
    timestamp: new Date().toISOString(),
    session_status: "completed",                 // or "exited_midway"
    correct_answers: 8,                          // replace with actual tracked values
    wrong_answers: 2,
    questions_attempted: 10,
    total_questions: 15,
    retry_count: 3,
    hints_used: 2,
    total_hints_embedded: 10,
    time_spent_seconds: 1200,
    topic_completion_ratio: 0.67
  };

  try {
    const response = await axios.post(
      'https://kaushik-dev.online/api/recommend/',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Show the recommendation to the student
    const recommendation = response.data;
    console.log('Learning state:', recommendation.learning_state);
    console.log('Recommendation:', recommendation.recommendation.reason);
    console.log('Next steps:', recommendation.recommendation.next_steps);

    return recommendation;

  } catch (error) {
    console.error('Failed to submit session:', error.message);

    // Store locally and retry later (see Section 9)
    localStorage.setItem('pendingPayload', JSON.stringify(payload));
  }
}
```

**Python (Flask) — Full integration:**

```python
import requests
from datetime import datetime, timezone
from flask import session

def submit_session_to_merge(tracked_data):
    token = session.get('token')
    student_id = session.get('student_id')
    session_id = session.get('session_id')

    payload = {
        "student_id": student_id,
        "session_id": session_id,
        "chapter_id": "grade6_fractions",  # YOUR chapter_id
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "session_status": "completed",
        "correct_answers": tracked_data["correct"],
        "wrong_answers": tracked_data["wrong"],
        "questions_attempted": tracked_data["correct"] + tracked_data["wrong"],
        "total_questions": tracked_data["total_questions"],
        "retry_count": tracked_data["retries"],
        "hints_used": tracked_data["hints_used"],
        "total_hints_embedded": tracked_data["total_hints"],
        "time_spent_seconds": tracked_data["time_spent"],
        "topic_completion_ratio": tracked_data["completed_topics"] / tracked_data["total_topics"]
    }

    response = requests.post(
        "https://kaushik-dev.online/api/recommend/",
        json=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )

    return response.json()
```

### 8.7 — When to Send the Payload

| Scenario | What to send |
|----------|-------------|
| Student completes all questions | `session_status: "completed"` |
| Student clicks "Exit" or leaves | Show a confirmation popup, then send with `session_status: "exited_midway"` |
| Network failure while sending | Store payload locally, retry with the **same** `session_id` |

**Send only ONCE per session.** Do not send payloads continuously during the session.

---

## 9. Handling Edge Cases

### Missing Values

Do not invent `0` for fields you don't track. Use `null` instead and inform the Merge Team during integration.

### Midway Exit (student closes tab or navigates away)

Show a confirmation popup. On confirmation, submit with `session_status: "exited_midway"`:

```javascript
window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
  event.returnValue = 'Your progress will be saved. Are you sure you want to leave?';
});
```

For guaranteed delivery even if the tab closes:

```javascript
window.addEventListener('unload', () => {
  const payload = JSON.stringify({
    student_id: sessionStorage.getItem("student_id"),
    session_id: sessionStorage.getItem("session_id"),
    chapter_id: "grade6_fractions",
    timestamp: new Date().toISOString(),
    session_status: "exited_midway",
    // ... rest of your tracked metrics
  });

  // sendBeacon works even when the page is closing
  navigator.sendBeacon('https://kaushik-dev.online/api/recommend/', payload);
});
```

### Network Failure — Retry Logic

```javascript
async function submitWithRetry(payload, token, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://kaushik-dev.online/api/recommend/',
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return response.data;  // Success
    } catch (error) {
      if (attempt === maxRetries - 1) {
        // All retries failed — save locally
        localStorage.setItem('pendingPayload', JSON.stringify(payload));
        console.error('All retries failed. Payload saved locally.');
      }
      // Wait before retrying (1s, 2s, 3s)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}
```

### Duplicate Submissions

Using the **same `session_id`** for retries is safe. Our system handles deduplication. **Never** generate a new `session_id` when retrying a failed submission — always reuse the one from the redirect URL.

---

## 10. Important Rules

### DO

- Listen on your designated app port, bound to `0.0.0.0`
- Extract `token`, `student_id`, and `session_id` from the redirect URL
- Use the `student_id` and `session_id` from the URL — never generate your own
- Use your exact canonical `chapter_id` as assigned
- Send **ONE** payload per session (at completion or confirmed exit)
- Include `Authorization: Bearer <token>` header when calling our API
- Install and use pm2 to keep your app running after SSH disconnect
- Implement retry logic for failed API calls
- Enforce the validation rules before submitting the payload
- Show the recommendation response to the student

### DO NOT

- Do NOT hardcode `student_id` or `session_id` — always use values from the redirect URL
- Do NOT change your app port
- Do NOT send payloads continuously during the session — only at session end
- Do NOT fabricate or use placeholder values in production
- Do NOT generate a new `session_id` when retrying a failed submission
- Do NOT calculate performance scores — our system does that
- Do NOT share your .pem key publicly (e.g., on GitHub)
- Do NOT try to access other team's containers
- Do NOT run your app on `localhost` or `127.0.0.1` — must be `0.0.0.0`

---

## 11. Common Mistakes & Fixes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| App listening on wrong port | 502 Bad Gateway | Change your app to listen on your designated port |
| App bound to `localhost` | 502 Bad Gateway | Change to `0.0.0.0` |
| App not running | 502 Bad Gateway | Start with pm2: `pm2 start server.js --name my-app` |
| Wrong .pem permissions | SSH says "permission denied" | `chmod 600 your-key.pem` |
| `cloudflared` not installed | SSH command fails | Install cloudflared (see Section 3.1) |
| Missing dependencies | App crashes on start | `npm install` or `pip3 install -r requirements.txt` |
| Not extracting token from URL | API returns 401 Unauthorized | Parse `token` from URL query params, include as Bearer token |
| Not extracting session_id from URL | Session tracking breaks | Parse `session_id` from URL query params |
| Wrong chapter_id in payload | Recommendation fails or returns wrong data | Use your exact canonical `chapter_id` |
| Sending multiple payloads per session | Duplicate records | Send only ONE payload at session end |
| App stops when SSH closes | Website goes down | Use pm2: `pm2 start`, `pm2 save`, `pm2 startup` |

---

## 12. Updating Your Code After Deployment

When you push new code to GitHub and want to update your live website:

```bash
# SSH into your container (see Section 3.3)

# Go to your project
cd ~/your-project

# Pull latest code
git pull origin main

# Install new dependencies if any
npm install                      # Node.js
pip3 install -r requirements.txt # Python

# Rebuild frontend if needed
cd client && npm run build && cd ..

# Restart your app
pm2 restart my-app
```

Your website updates within seconds.

---

## 13. Useful Commands Inside Your Container

```bash
# Process management
pm2 status                    # Is my app running?
pm2 logs                      # View live logs
pm2 logs --lines 50           # Last 50 lines
pm2 restart my-app            # Restart app
pm2 stop my-app               # Stop app

# System checks
ss -tlnp | grep YOUR_PORT    # What's listening on my port?
df -h                         # Disk usage
free -h                       # Memory usage

# App checks
ps aux | grep node            # Find running Node processes
ps aux | grep python          # Find running Python processes
curl http://localhost:YOUR_PORT  # Test your app locally
```

---

## 14. Getting Help

If you face issues, contact the **Merge Team** with:

1. Your team name and container name
2. The exact error message
3. What command you ran
4. Screenshot if possible

**Do NOT attempt to fix infrastructure issues (network, ports, proxy) yourself.** Contact us and we will resolve it.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                     QUICK REFERENCE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INSTALL CLOUDFLARED (one-time):                                │
│    Mac:     brew install cloudflared                             │
│    Windows: download .msi from cloudflare github releases       │
│    Linux:   sudo dpkg -i cloudflared.deb                        │
│                                                                 │
│  SSH INTO YOUR SERVER:                                          │
│    ssh -o ProxyCommand="cloudflared access ssh                  │
│      --hostname YOUR_SSH_HOSTNAME"                              │
│      -i YOUR_KEY.pem YOUR_USERNAME@YOUR_SSH_HOSTNAME            │
│                                                                 │
│  YOUR WEBSITE URL:                                              │
│    https://YOUR_CONTAINER_NAME.kaushik-dev.online               │
│                                                                 │
│  YOUR APP MUST:                                                 │
│    1. Listen on YOUR_APP_PORT bound to 0.0.0.0                  │
│    2. Extract token, student_id, session_id from redirect URL   │
│    3. Send ONE payload to /api/recommend/ at session end         │
│    4. Include Authorization: Bearer <token> header               │
│                                                                 │
│  KEEP APP RUNNING:                                              │
│    pm2 start server.js --name "my-app"                          │
│    pm2 save                                                     │
│    pm2 startup                                                  │
│                                                                 │
│  RECOMMENDATION API:                                            │
│    POST https://kaushik-dev.online/api/recommend/               │
│    Authorization: Bearer <token_from_redirect_url>              │
│                                                                 │
│  REDIRECT URL FORMAT (what students arrive with):               │
│    https://your-site.kaushik-dev.online/chapter                 │
│      ?token=<jwt>&student_id=STD-42&session_id=sess_abc123      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
