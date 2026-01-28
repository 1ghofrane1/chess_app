pipeline {
    agent any
    stages {
        stage('step1') {
            steps {
                sh 'echo étape un'
            }
        }
        stage('step2') {
            steps {
                sh 'echo étape deux'
            }   
        }
        stage('Message') {
            steps {
                echo 'Hello from my 3rd stage!'
            }
        }
    }
}