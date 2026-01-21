#!/bin/bash

# Jenkins Agent Setup Script
# Run this on your agent machine (EC2, VM, etc.)

set -e

echo "🔧 Jenkins Agent Setup Script"
echo "=============================="
echo ""

# Configuration
JENKINS_URL="${JENKINS_URL:-http://localhost:8080}"
AGENT_NAME="${AGENT_NAME:-docker-agent}"
AGENT_WORK_DIR="${AGENT_WORK_DIR:-/home/jenkins/agent}"
AGENT_USER="${AGENT_USER:-jenkins}"

# Check Java version
echo "📋 Checking Java version..."
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 11 ]; then
    echo "❌ Java 11 or 17 required. Found: Java $JAVA_VERSION"
    echo "Installing Java 17..."
    sudo apt update
    sudo apt install -y openjdk-17-jdk
    sudo update-alternatives --config java
else
    echo "✅ Java version OK: $(java -version 2>&1 | head -n 1)"
fi

# Check Docker
echo ""
echo "📋 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $AGENT_USER
    rm get-docker.sh
else
    echo "✅ Docker installed: $(docker --version)"
fi

# Create work directory
echo ""
echo "📁 Creating agent work directory..."
sudo mkdir -p $AGENT_WORK_DIR
sudo chown $AGENT_USER:$AGENT_USER $AGENT_WORK_DIR

# Download agent.jar
echo ""
echo "📥 Downloading agent.jar from Jenkins controller..."
AGENT_JAR="$AGENT_WORK_DIR/agent.jar"
curl -o $AGENT_JAR "$JENKINS_URL/jnlpJars/agent.jar"

if [ ! -f "$AGENT_JAR" ]; then
    echo "❌ Failed to download agent.jar"
    echo "Please check:"
    echo "  1. Jenkins URL is correct: $JENKINS_URL"
    echo "  2. Network connectivity to Jenkins"
    echo "  3. Jenkins is running"
    exit 1
fi

echo "✅ agent.jar downloaded"

# Get agent secret (user needs to provide)
echo ""
echo "🔐 Agent Configuration"
echo "======================"
echo "Please provide the following from Jenkins:"
echo "  1. Go to: Manage Jenkins → Nodes → $AGENT_NAME → Configure"
echo "  2. Copy the 'Secret' from the agent configuration"
echo ""
read -p "Enter agent secret: " AGENT_SECRET

if [ -z "$AGENT_SECRET" ]; then
    echo "❌ Agent secret is required"
    exit 1
fi

# Create systemd service
echo ""
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/jenkins-agent.service > /dev/null <<EOF
[Unit]
Description=Jenkins Agent
After=network.target

[Service]
Type=simple
User=$AGENT_USER
WorkingDirectory=$AGENT_WORK_DIR
ExecStart=/usr/bin/java -jar $AGENT_JAR \\
  -jnlpUrl $JENKINS_URL/computer/$AGENT_NAME/jenkins-agent.jnlp \\
  -secret $AGENT_SECRET \\
  -workDir $AGENT_WORK_DIR
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "🚀 Starting Jenkins agent service..."
sudo systemctl daemon-reload
sudo systemctl enable jenkins-agent
sudo systemctl start jenkins-agent

# Check status
sleep 3
if sudo systemctl is-active --quiet jenkins-agent; then
    echo "✅ Jenkins agent service started successfully!"
    echo ""
    echo "📊 Service status:"
    sudo systemctl status jenkins-agent --no-pager
else
    echo "❌ Failed to start Jenkins agent service"
    echo "Check logs: sudo journalctl -u jenkins-agent -f"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Useful commands:"
echo "  View logs:    sudo journalctl -u jenkins-agent -f"
echo "  Restart:      sudo systemctl restart jenkins-agent"
echo "  Stop:         sudo systemctl stop jenkins-agent"
echo "  Status:       sudo systemctl status jenkins-agent"
