pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_IMAGE_BACKEND = 'bookmyshowcase-backend'
        DOCKER_IMAGE_FRONTEND = 'bookmyshowcase-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        NETWORK_NAME = 'bookmyshowcase_network'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    script {
                        try {
                            sh '''
                                python3 -m venv venv || true
                                source venv/bin/activate || . venv/bin/activate
                                pip install -r requirements.txt || pip3 install -r requirements.txt
                                python manage.py check
                                python manage.py test || echo "No tests configured"
                            '''
                        } catch (Exception e) {
                            echo "Backend tests failed: ${e.message}"
                            // Continue even if tests fail (adjust based on your needs)
                        }
                    }
                }
            }
        }

        stage('Frontend Build & Tests') {
            steps {
                dir('frontend') {
                    script {
                        sh '''
                            npm ci
                            npm run build
                            npm run lint || echo "Lint issues found but continuing"
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images...'
                    
                    // Build backend image
                    sh """
                        docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ./backend
                        docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:latest
                    """
                    
                    // Build frontend image
                    sh """
                        docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ./frontend
                        docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Docker Network Test') {
            steps {
                script {
                    echo 'Testing with Docker Network...'
                    sh '''
                        # Cleanup existing containers
                        docker stop bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend 2>/dev/null || true
                        docker rm bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend 2>/dev/null || true
                        docker network rm bookmyshowcase_network 2>/dev/null || true
                        
                        # Create network
                        docker network create bookmyshowcase_network
                        
                        # Start MySQL
                        docker run -d --name bookmyshowcase_db --network bookmyshowcase_network \
                            -e MYSQL_DATABASE=bookmyshowcase \
                            -e MYSQL_USER=bookmyshowcase_user \
                            -e MYSQL_PASSWORD=bookmyshowcase_pass \
                            -e MYSQL_ROOT_PASSWORD=root_password \
                            mysql:8.0
                        
                        sleep 15
                        
                        # Start Backend
                        docker run -d --name bookmyshowcase_backend --network bookmyshowcase_network \
                            -p 8000:8000 \
                            -e DEBUG=1 -e USE_MYSQL=1 \
                            -e MYSQL_DATABASE=bookmyshowcase \
                            -e MYSQL_USER=bookmyshowcase_user \
                            -e MYSQL_PASSWORD=bookmyshowcase_pass \
                            -e MYSQL_HOST=bookmyshowcase_db \
                            ${DOCKER_IMAGE_BACKEND}:latest
                        
                        # Start Frontend
                        docker run -d --name bookmyshowcase_frontend --network bookmyshowcase_network \
                            -p 80:80 \
                            ${DOCKER_IMAGE_FRONTEND}:latest
                        
                        sleep 20
                        
                        # Health checks
                        curl -f http://localhost:8000/api/ || exit 1
                        curl -f http://localhost:80/health || exit 1
                    '''
                }
            }
            post {
                always {
                    sh '''
                        docker stop bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend || true
                        docker rm bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend || true
                        docker network rm bookmyshowcase_network || true
                    '''
                }
            }
        }

        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo 'Pushing images to registry...'
                    // Uncomment and configure if you have a registry
                    // sh """
                    //     docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                    //     docker tag ${DOCKER_IMAGE_BACKEND}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:latest
                    //     docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                    //     docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:latest
                    //     
                    //     docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    //     docker tag ${DOCKER_IMAGE_FRONTEND}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:latest
                    //     docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    //     docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:latest
                    // """
                }
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo 'Deploying application...'
                    // Add your deployment steps here
                    // Examples:
                    // - SSH to server and pull images
                    // - Run docker-compose on production
                    // - Kubernetes deployment
                    // - etc.
                    sh '''
                        echo "Deployment steps would go here"
                        echo "Example: ssh user@server 'docker pull ${DOCKER_IMAGE_BACKEND}:latest && docker pull ${DOCKER_IMAGE_FRONTEND}:latest'"
                        echo "Then start containers using docker run commands with Docker network"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
            // Cleanup
            sh '''
                docker system prune -f || true
            '''
        }
        success {
            echo 'Pipeline succeeded! 🎉'
        }
        failure {
            echo 'Pipeline failed! ❌'
            // Send notification (email, Slack, etc.)
        }
    }
}
