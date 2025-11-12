import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 
                 'https://your-api-gateway-url/stage/visit'; // Replace with your actual API URL

  useEffect(() => {
    // Only increment visitor count for /projects page
    if (location.pathname !== '/projects') {
      setLoading(false);
      return;
    }

    const incrementVisitorCount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: location.pathname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVisitorCount(data.count);
      } catch (err) {
        console.error('Failed to fetch visitor count:', err);
        setError('Failed to load visitor count');
        setVisitorCount(null);
      } finally {
        setLoading(false);
      }
    };

    incrementVisitorCount();
  }, [location.pathname, API_URL]);

  if (loading) {
    return (
      <div className="visitor-counter">
        <span>Loading...</span>
      </div>
    );
  }

  if (error || visitorCount === null) {
    return (
      <div className="visitor-counter">
        <span>👥 Visitors</span>
      </div>
    );
  }

  return (
    <div className="visitor-counter">
      <span>👥 Visitor #{visitorCount.toLocaleString()}</span>
    </div>
  );
};

export default VisitorCounter;