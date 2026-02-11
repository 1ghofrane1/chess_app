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
        sh 'npm run test:e2e'   
      }
    }

  stage('Deploy to Netlify') {
    environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
      }
      when { branch 'main' }
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.57.0-noble'
          args '--network=host'
        }
      }
      
      steps {
        sh 'npm install'
        sh 'npm run build'
        sh 'node node_modules/netlify-cli/bin/run.js deploy --prod --site chessappcicd.netlify.app'
      }
    }
   stage('Docker Build & Push') {
      agent any
      when { branch 'main' }

      environment {
        CI_REGISTRY = 'ghcr.io'
        CI_REGISTRY_USER = '1ghofrane1'
        CI_REGISTRY_IMAGE = "${CI_REGISTRY}/${CI_REGISTRY_USER}/chess"
        CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
      }

      steps {
        sh 'docker build -t $CI_REGISTRY_IMAGE:latest .'
        sh 'echo $CI_REGISTRY_PASSWORD | docker login $CI_REGISTRY -u $CI_REGISTRY_USER --password-stdin'
        sh 'docker push $CI_REGISTRY_IMAGE:latest'
      }
    }
  }

  post {
    always {
      /*publishHTML([
        allowMissing: true,
        alwaysLinkToLastBuild: false,
        keepAll: true,
        reportDir: 'vitest-report',
        reportFiles: 'index.html',
        reportName: 'VitestReport',
        reportTitles: '',
        useWrapperFileDirectly: true
      ])*/

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
