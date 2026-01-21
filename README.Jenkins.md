# Jenkins CI/CD Setup Guide

## Prerequisites

### Jenkins Controller Requirements
- **Java**: Java 11 or Java 17 (Java 8 will cause handshake failures)
- **Jenkins**: Latest LTS version recommended
- **Ports**: 
  - HTTP/HTTPS: 8080 (default) or configured port
  - JNLP/TCP: 50000 (default) for agent connections

### Agent Requirements
- **Java**: Java 11 or Java 17 (must match controller)
- **Docker**: Installed and running
- **Network**: Access to Jenkins controller
- **Ports**: TCP 50000 open (if using JNLP agents)

## Common Issues & Fixes

### 1️⃣ Jenkins Controller & Agent Version Mismatch (90% cases)

**Problem**: Agent uses older/newer agent.jar than controller expects.

**Fix**:
```bash
# On agent machine, download fresh agent.jar from controller
wget http://<jenkins-url>/jnlpJars/agent.jar

# Or use direct URL
curl -O http://<jenkins-url>/jnlpJars/agent.jar

# Connect agent
java -jar agent.jar -jnlpUrl http://<jenkins-url>/computer/<agent-name>/jenkins-agent.jnlp \
  -secret <agent-secret> \
  -workDir /path/to/agent/work
```

**Always download agent.jar directly from controller**: `http://<jenkins-url>/jnlpJars/agent.jar`

### 2️⃣ Wrong Jenkins URL / Reverse Proxy Issue

**Problem**: Jenkins behind Nginx/ALB, headers not passing correctly.

**Fix - Nginx Config**:
```nginx
location / {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
    
    # For WebSocket (Jenkins console)
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}

# JNLP endpoint
location /jenkins-agent.jnlp {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Check Jenkins URL**:
- Go to: `Manage Jenkins → System → Jenkins URL`
- Must match the real URL (including protocol: http:// or https://)

### 3️⃣ JNLP / TCP Port Blocked

**Problem**: JNLP needs TCP port 50000 (default).

**Check port**:
```bash
# Check if port is listening
netstat -tulnp | grep 50000
# or
ss -tulnp | grep 50000
```

**Open firewall**:
```bash
# Ubuntu/Debian
sudo ufw allow 50000/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=50000/tcp
sudo firewall-cmd --reload

# Or disable TCP agents entirely
# Manage Jenkins → Security → Agents → TCP port for inbound agents → Disable
```

### 4️⃣ Java Version Incompatible

**Problem**: New Jenkins needs Java 11 or 17. Java 8 causes handshake failures.

**Check Java version**:
```bash
java -version
```

**Install Java 17**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# CentOS/RHEL
sudo yum install java-17-openjdk-devel

# Verify
java -version
# Should show: openjdk version "17.x.x"
```

**Set JAVA_HOME**:
```bash
# Find Java 17 path
sudo update-alternatives --config java

# Add to ~/.bashrc or /etc/environment
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### 5️⃣ HTTPS / HTTP Mismatch

**Problem**: Controller is HTTPS but agent tries HTTP (or vice-versa).

**Fix**: Ensure consistency:
- ✅ Jenkins URL: `https://jenkins.example.com`
- ✅ JNLP URL: `https://jenkins.example.com/...`
- ✅ Reverse proxy: HTTPS enabled
- ✅ Agent connection: Uses HTTPS

## Quick Checklist

Follow in order:

- ✅ Jenkins controller & agent same version
- ✅ Fresh agent.jar downloaded from controller
- ✅ Java 11/17 on agent (not Java 8)
- ✅ Correct Jenkins URL configured
- ✅ Port 50000 reachable OR disabled
- ✅ No proxy breaking headers
- ✅ HTTPS/HTTP consistent everywhere

## Pipeline Setup

### 1. Create Pipeline Job

1. Go to Jenkins Dashboard
2. Click "New Item"
3. Enter name: `bookmyshowcase-pipeline`
4. Select "Pipeline"
5. Click OK

### 2. Configure Pipeline

**Pipeline Definition**:
- Select: "Pipeline script from SCM"
- SCM: Git
- Repository URL: Your Git repository URL
- Branch: `*/main` or `*/master`
- Script Path: `Jenkinsfile`

### 3. Configure Credentials (Optional)

If using Docker registry:

1. Go to: `Manage Jenkins → Credentials`
2. Add credentials:
   - Kind: Secret text
   - ID: `docker-registry-url`
   - Secret: Your registry URL

### 4. Run Pipeline

Click "Build Now" to trigger the pipeline.

## Agent Setup (Docker Agent)

### Using Docker Agent Plugin

**Install Plugin**:
1. `Manage Jenkins → Plugins`
2. Search: "Docker Pipeline"
3. Install

**Configure Docker Agent**:
```groovy
pipeline {
    agent {
        docker {
            image 'docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    // ... rest of pipeline
}
```

### Using EC2/VM Agent

**Create Node**:
1. `Manage Jenkins → Nodes → New Node`
2. Name: `docker-agent`
3. Type: Permanent Agent
4. Configure:
   - Remote root directory: `/home/jenkins/agent`
   - Launch method: Launch agent via Java Web Start
   - Labels: `docker`

**On Agent Machine**:
```bash
# Install Docker
sudo apt install docker.io docker-compose
sudo usermod -aG docker jenkins

# Download agent.jar
wget http://<jenkins-url>/jnlpJars/agent.jar

# Create startup script
cat > /etc/systemd/system/jenkins-agent.service << EOF
[Unit]
Description=Jenkins Agent
After=network.target

[Service]
Type=simple
User=jenkins
ExecStart=/usr/bin/java -jar /opt/jenkins/agent.jar \
  -jnlpUrl http://<jenkins-url>/computer/docker-agent/jenkins-agent.jnlp \
  -secret <secret-from-jenkins> \
  -workDir /home/jenkins/agent
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl enable jenkins-agent
sudo systemctl start jenkins-agent
```

## Troubleshooting Commands

### Check Jenkins Version
```bash
# On controller
curl http://localhost:8080/api/json | jq .version
```

### Check Agent Connection
```bash
# On agent
java -jar agent.jar -jnlpUrl http://<jenkins-url>/computer/<agent>/jenkins-agent.jnlp \
  -secret <secret> \
  -workDir /tmp/test
```

### View Jenkins Logs
```bash
# Controller logs
tail -f /var/log/jenkins/jenkins.log

# Or via web UI
Manage Jenkins → System Log → All Jenkins Logs
```

### Test Docker on Agent
```bash
# SSH to agent
docker ps
docker build --help
docker network ls
```

## Environment Variables

Set these in Jenkins:
- `DOCKER_REGISTRY`: Docker registry URL (optional)
- `DOCKER_IMAGE_BACKEND`: Backend image name
- `DOCKER_IMAGE_FRONTEND`: Frontend image name

## Pipeline Stages Explained

1. **Checkout**: Git repository clone
2. **Backend Tests**: Django checks and tests
3. **Frontend Build**: React build and lint
4. **Build Docker Images**: Build backend & frontend images
5. **Docker Network Test**: Test with Docker network (no compose)
6. **Push to Registry**: Push images (if configured)
7. **Deploy**: Deploy to production (configure as needed)

## Security Best Practices

1. **Use Credentials Plugin** for secrets
2. **Restrict agent access** to specific jobs
3. **Use HTTPS** for Jenkins
4. **Keep Jenkins updated** to latest LTS
5. **Monitor agent connections** regularly
6. **Use Docker secrets** for sensitive data

## Need Help?

Provide these details for specific help:
- Jenkins version
- Agent type (Docker / EC2 / VM)
- Is Jenkins behind Nginx / ALB?
- Java version on agent
- Error messages from logs
