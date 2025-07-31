import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [visibleUrl, setVisibleUrl] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [deployments, setDeployments] = useState([]);

  const handleDeploy = async () => {
    if (!githubUrl) return;

    setIsDeploying(true);
    setDeploymentStatus('Deploying...');
    setDeployedUrl('');
    setVisibleUrl(false);
    setCountdown(0);

    try {
      const response = await fetch('http://localhost:3000/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: githubUrl }),
      });

      const data = await response.json();

      if (data.id) {
        const url = `http://${data.id}.localhost:3001`;
        setDeploymentStatus('Deployed successfully! Showing in 10 seconds...');
        setDeployedUrl(url);
        setCountdown(10);
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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && deployedUrl) {
      setVisibleUrl(true);
    }
  }, [countdown, deployedUrl]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">DeployHub</h1>
          <p className="tagline">Instant GitHub Repository Deployment</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="deploy-card">
            <h2 className="card-title">New Deployment</h2>
            <div className="input-group">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="url-input"
              />
              <button 
                onClick={handleDeploy} 
                disabled={isDeploying || !githubUrl}
                className={`deploy-button ${isDeploying ? 'loading' : ''}`}
              >
                {isDeploying ? (
                  <>
                    <span className="spinner"></span>
                    Deploying...
                  </>
                ) : (
                  'Deploy Now'
                )}
              </button>
            </div>

            {deploymentStatus && (
              <div className={`status-card ${visibleUrl ? 'success' : isDeploying ? 'pending' : 'error'}`}>
                <div className="status-header">
                  <span className="status-icon">
                    {visibleUrl ? '✓' : isDeploying ? '⏳' : '✗'}
                  </span>
                  <h3 className="status-title">{deploymentStatus}</h3>
                </div>
                {!visibleUrl && countdown > 0 && (
                  <div className="countdown">
                    <p>Your deployment will be ready in</p>
                    <div className="countdown-timer">{countdown}s</div>
                  </div>
                )}
                {visibleUrl && deployedUrl && (
                  <div className="deployed-url">
                    <p>Your application is live at:</p>
                    <a 
                      href={deployedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="live-url"
                    >
                      {deployedUrl}
                    </a>
                    <button 
                      onClick={() => navigator.clipboard.writeText(deployedUrl)}
                      className="copy-button"
                    >
                      Copy URL
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {deployments.length > 0 && (
            <div className="deployments-card">
              <h2 className="card-title">Recent Deployments</h2>
              <div className="deployments-list">
                {deployments.map((deployment, index) => (
                  <div key={index} className="deployment-item">
                    <div className="deployment-info">
                      <span className="deployment-id">#{deployment.id}</span>
                      <a 
                        href={deployment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="deployment-link"
                      >
                        {deployment.url}
                      </a>
                    </div>
                    <span className={`deployment-status ${deployment.status}`}>
                      {deployment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} DeployHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;