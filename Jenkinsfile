pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        copyArtifactPermission('/expense-tracker-cd')
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install and Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }
        stage('Coverage') {
            steps { sh 'npm run coverage' }
        }
        stage('SonarQube Analysis') {
            when { branch 'main' }
            environment { SCANNER_HOME = tool 'SonarScanner' }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '"$SCANNER_HOME/bin/sonar-scanner"'
                }
            }
        }
        stage('Quality Gate') {
            when { branch 'main' }
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Build') {
            when { anyOf { branch 'main'; branch 'develop' } }
            steps { sh 'npm run build' }
        }
        stage('Archive Artifact') {
            when { branch 'main' }
            steps {
                sh 'tar -czf react-app-$BUILD_NUMBER.tar.gz dist Dockerfile nginx.conf'
                archiveArtifacts artifacts: "react-app-${env.BUILD_NUMBER}.tar.gz", fingerprint: true
            }
        }
    }
}
