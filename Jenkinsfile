pipeline {
    agent any
    stages {
        stage('Build') {
            agent{
                docker{
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}