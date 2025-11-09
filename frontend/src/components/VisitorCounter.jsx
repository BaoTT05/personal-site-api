import { useState, useEffect } from 'react';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Replace with actual API Gateway URL when deployed
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/visit';

  useEffect(() => {
    const incrementVisitorCount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVisitorCount(data.count);
      } catch (err) {
        console.error('Failed to fetch visitor count:', err);
        setError('Failed to load visitor count');
      } finally {
        setLoading(false);
      }
    };

    incrementVisitorCount();
  }, []);

  if (loading) {
    return (
      <div className="visitor-counter loading">
        <p>Loading visitor count...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visitor-counter error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="visitor-counter">
      <p className="counter-text">
        👥 Visitor #{visitorCount?.toLocaleString()}
      </p>
    </div>
  );
};

export default VisitorCounter;