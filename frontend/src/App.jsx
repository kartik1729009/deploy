import React, { useState } from 'react';
import './App.css';

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [deployments, setDeployments] = useState([]);

  const handleDeploy = async () => {
    if (!githubUrl) return;
    
    setIsDeploying(true);
    setDeploymentStatus('Deploying...');
    setDeployedUrl('');

    try {
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:3000/deploy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ repoUrl: githubUrl }), // Fix: repoUrl, not githubUrl
});


      const data = await response.json();
      
      if (data.id) {
        setDeploymentStatus('Deployed successfully!');
        const url = `http://${data.id}.localhost:3001`;
        setDeployedUrl(url);
        setDeployments(prev => [...prev, { id: data.id, url, status: 'deployed' }]);
      } else {
        setDeploymentStatus('Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>DeployIt</h1>
        <p>Deploy your frontend projects with ease</p>
      </header>

      <main className="main-content">
        <div className="deploy-form">
          <h2>New Deployment</h2>
          <div className="input-group">
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="Enter GitHub repository URL"
              className="url-input"
            />
            <button 
              onClick={handleDeploy} 
              disabled={isDeploying || !githubUrl}
              className="deploy-button"
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>
          </div>
          
          {deploymentStatus && (
            <div className={`status ${deployedUrl ? 'success' : 'error'}`}>
              {deploymentStatus}
              {deployedUrl && (
                <div className="deployed-url">
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                    {deployedUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {deployments.length > 0 && (
          <div className="deployments-list">
            <h2>Your Deployments</h2>
            <ul>
              {deployments.map((deployment, index) => (
                <li key={index} className="deployment-item">
                  <span className="deployment-id">{deployment.id}</span>
                  <a 
                    href={deployment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="deployment-link"
                  >
                    {deployment.url}
                  </a>
                  <span className={`status-badge ${deployment.status}`}>
                    {deployment.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2023 DeployIt - A simple deployment service</p>
      </footer>
    </div>
  );
}

export default App;