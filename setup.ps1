Write-Host "Setting up Pokemon Chess Game..." -ForegroundColor Green

# Create directories
New-Item -ItemType Directory -Force -Path "public" | Out-Null
New-Item -ItemType Directory -Force -Path "src" | Out-Null

# Create package.json
@'
{
  "name": "pokemon-chess",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
'@ | Out-File -FilePath "package.json" -Encoding UTF8

# Create public/index.html
@'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Pokemon Chess Battle Game" />
    <title>Pokemon Chess Battle</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
'@ | Out-File -FilePath "public\index.html" -Encoding UTF8

# Create src/index.js
@'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'@ | Out-File -FilePath "src\index.js" -Encoding UTF8

# Create src/index.css
@'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
'@ | Out-File -FilePath "src\index.css" -Encoding UTF8

# Create .gitignore
@'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
'@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host ""
Write-Host "Project structure created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure your src/App.jsx file exists (the Pokemon Chess game)"
Write-Host "2. Run: npm install"
Write-Host "3. Run: npm start (to test locally)"
Write-Host "4. Run: git add ."
Write-Host "5. Run: git commit -m 'Add Pokemon Chess game'"
Write-Host "6. Run: git push origin main"
Write-Host ""
Write-Host "Vercel will auto-deploy after you push!" -ForegroundColor Cyan