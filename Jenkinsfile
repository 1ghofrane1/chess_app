pipeline {
  agent any

  stages {
    stage('CI') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.57.0-noble'
          args '--network=host'
        }
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
        sh 'npm run test'       
        sh 'npm run test:e2e'   
      }
    }
  }

  post {
    always {
      publishHTML([
        allowMissing: true,
        alwaysLinkToLastBuild: false,
        keepAll: true,
        reportDir: 'vitest-report',
        reportFiles: 'index.html',
        reportName: 'VitestReport',
        reportTitles: '',
        useWrapperFileDirectly: true
      ])

      publishHTML([
        allowMissing: true,
        alwaysLinkToLastBuild: false,
        keepAll: true,
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'PlaywrightReport',
        reportTitles: '',
        useWrapperFileDirectly: true
      ])
    }
  }
}
