# Security Policy (ℹ️ it's currently under construction.)

## 🔒 Security Commitment

**dynamicdev_** takes the security of **bases_on** seriously. As this is a database management tool with privileged access to PostgreSQL instances, we follow strict security practices.

---

## 🛡️ Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Notes |
| ------- | ------------------ | ----- |
| latest  | ✅ Yes             | Docker tag `latest` — always recommended |
| 1.x.x   | ✅ Yes             | Current stable branch |
| < 1.0   | ❌ No              | Pre-release versions — upgrade immediately |

**Upstream pgAdmin 4 Security:** We monitor the [pgAdmin security page](https://www.pgadmin.org/support/security/) and backport critical fixes within **48 hours** of disclosure.

---

## 🚨 Reporting a Vulnerability

### Do NOT Report Publicly

**NEVER** open a public GitHub issue for security vulnerabilities. This could put all users at risk.

### Secure Reporting Channel

**Email:** admin@dynamicdev.asia  
**PGP Key:** [Download here](https://dynamicdev.asia/.well-known/pgp-key.txt) *(optional but recommended)*

### What to Include

Please provide:

1. **Description** — Clear explanation of the vulnerability
2. **Impact** — Who/what is affected?
3. **Reproduction Steps** — Detailed steps to reproduce
4. **Proof of Concept** — Code snippet or screenshot (if safe to share)
5. **Suggested Fix** — If you have one (optional)
6. **Your Contact Info** — For follow-up questions

### Example Report

```
Subject: [SECURITY] SQL Injection in Server Connection Form

Description:
The server connection form accepts unsanitized user input in the 
"Host" field, allowing SQL injection when connection parameters are 
stored in the configuration database.

Impact:
- Authenticated users can execute arbitrary SQL on the pgAdmin config DB
- Potential credential theft from stored connection passwords
- Affects versions: 1.0.0 - 1.2.3

Reproduction:
1. Log in to bases_on
2. Navigate to "Add New Server"
3. In "Host" field, enter: '; DROP TABLE users; --
4. Save connection
5. Observe SQL error revealing injection vulnerability

Proof of Concept:
(attach sanitized screenshot or SQL payload)

Suggested Fix:
Use parameterized queries in web/pgadmin/browser/server_groups/servers/utils.py
line 145 instead of string concatenation.

Contact: researcher@example.com
```

---

## ⏱️ Response Timeline

| Stage | Timeline | Action |
|-------|----------|--------|
| **Initial Response** | 48 hours | We acknowledge receipt |
| **Triage** | 5 business days | Severity assessment & reproduction |
| **Fix Development** | Varies by severity | See table below |
| **Disclosure** | 90 days max | Coordinated disclosure |

### Severity-Based Fix Timeline

| Severity | Fix Timeline | Example |
|----------|--------------|---------|
| **Critical** | 24-48 hours | Remote code execution, authentication bypass |
| **High** | 7 days | SQL injection, privilege escalation |
| **Medium** | 30 days | XSS, CSRF, information disclosure |
| **Low** | 90 days | Minor information leaks, non-exploitable bugs |

---

## 🔐 Security Best Practices

### For Deployment

```yaml
# ✅ RECOMMENDED SECURE CONFIGURATION

services:
  bases_on:
    image: ghcr.io/dynamicdev-official/bases_on:latest
    restart: unless-stopped
    
    # 1. Use secrets instead of environment variables
    secrets:
      - pgadmin_email
      - pgadmin_password
    
    # 2. Run behind reverse proxy with TLS
    labels:
      - "traefik.http.routers.bases-on.tls=true"
    
    # 3. Limit network exposure
    networks:
      - internal  # No direct internet access
    
    # 4. Read-only root filesystem
    read_only: true
    tmpfs:
      - /tmp
      - /run
    
    # 5. Drop unnecessary capabilities
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    
    # 6. Non-root user
    user: "5050:5050"
    
    # 7. Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G

secrets:
  pgadmin_email:
    file: ./secrets/email.txt
  pgadmin_password:
    file: ./secrets/password.txt
```

### Strong Password Policy

```bash
# ✅ Generate strong password
openssl rand -base64 32

# ❌ NEVER use these
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_DEFAULT_PASSWORD=password123
PGADMIN_DEFAULT_PASSWORD=pgadmin
```

### TLS/SSL Configuration

```nginx
# Nginx reverse proxy config
server {
    listen 443 ssl http2;
    server_name db.dynamicdev.asia;
    
    # Strong SSL configuration
    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/private/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://bases_on:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Network Segmentation

```yaml
# Separate networks for different security zones
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No internet access

services:
  traefik:
    networks:
      - frontend
  
  bases_on:
    networks:
      - frontend  # For user access
      - backend   # For DB access
  
  postgres:
    networks:
      - backend   # Isolated from internet
```

---

## 🔍 Known Security Considerations

### Inherited from pgAdmin 4

As a fork of pgAdmin 4, we inherit its security model:

1. **Session Management**
   - Sessions stored in PostgreSQL or SQLite
   - CSRF protection enabled by default
   - Configurable session timeout

2. **Password Storage**
   - Stored server passwords encrypted with master password
   - Master password never persists in plain text
   - AES-256 encryption for sensitive data

3. **SQL Injection Protection**
   - Parameterized queries throughout
   - Input validation on all forms
   - Whitelisting for connection parameters

### bases_on-Specific Risks

1. **Custom Branding Code**
   - All custom UI changes audited for XSS
   - No user input in branding components
   - CSP headers enforced

2. **Docker Image Supply Chain**
   - Base image: `python:3.11-alpine` (official)
   - All dependencies pinned with hashes
   - Multi-stage build reduces attack surface

---

## 🔧 Security Features

### Built-in Protections

- ✅ **HTTPS Enforcement** — Redirect HTTP to HTTPS (when behind proxy)
- ✅ **CSRF Tokens** — All POST requests protected
- ✅ **Content Security Policy** — Strict CSP headers
- ✅ **X-Frame-Options** — Clickjacking protection
- ✅ **Session Fixation Protection** — New session on login
- ✅ **Brute Force Protection** — Rate limiting on login
- ✅ **SQL Injection Protection** — Parameterized queries
- ✅ **XSS Protection** — Input sanitization & output encoding

### Security Headers

```python
# web/pgadmin/utils/security.py (excerpt)

SECURITY_HEADERS = {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
}
```

---

## 📜 Security Audit History

| Date | Type | Findings | Status |
|------|------|----------|--------|
| 2026-04-05 | Internal Code Review | None | ✅ Passed |
| 2026-03-15 | Dependency Audit | 2 low-severity npm packages | ✅ Updated |

*We conduct internal security reviews quarterly.*

---

## 🏆 Security Hall of Fame

We recognize security researchers who responsibly disclose vulnerabilities:

| Date | Researcher | Vulnerability | Severity |
|------|------------|---------------|----------|
| *None yet* | - | - | - |

**Want to be listed?** Report a valid security issue and opt-in to public recognition.

---

## 🔗 Security Resources

- 🔒 **pgAdmin Security Page:** https://www.pgadmin.org/support/security/
- 🔒 **PostgreSQL Security:** https://www.postgresql.org/support/security/
- 🔒 **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- 🔒 **CWE Database:** https://cwe.mitre.org/

---

## 📞 Contact

**Security Team:** admin@dynamicdev.asia  
**PGP Key:** [Download](https://dynamicdev.asia/.well-known/pgp-key.txt)  
**Response Time:** 48 hours

For non-security issues, use:
- General inquiries: bases_on@dynamicdev.asia
- Bug reports: [GitHub Issues](https://github.com/dynamicdev-official/bases_on/issues)

---

## 📄 Disclosure Policy

### Coordinated Disclosure

1. **Report received** → We acknowledge within 48 hours
2. **Fix developed** → Timeline based on severity
3. **Patch released** → Security advisory published
4. **90-day disclosure** — If no fix, we disclose responsibly

### Public Disclosure

After a fix is released, we publish:
- 📝 Security advisory (GitHub Security Advisories)
- 📝 CVE assignment (if applicable)
- 📝 Blog post with technical details
- 📝 Credit to researcher (with permission)

---

**Thank you for keeping bases_on secure! 🔒**

*dynamicdev_ Security Team | Bangkok, Thailand*
