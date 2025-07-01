import { useEffect, useState } from 'react';
import './CryptoDetail.css';

interface CryptoDetailProps {
  cryptoId: string;
  onClose: () => void;
}

interface CryptoDetailData {
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number; brl: number };
    market_cap: { usd: number; brl: number };
    total_volume: { usd: number; brl: number };
    high_24h: { usd: number; brl: number };
    low_24h: { usd: number; brl: number };
  };
  description: { en: string };
}

const CryptoDetail = ({ cryptoId, onClose }: CryptoDetailProps) => {
  const [detail, setDetail] = useState<CryptoDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch coin details');
        }
        const data = await response.json();
        setDetail(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [cryptoId]);

  if (loading) {
    return <div className="modal-overlay"><div className="modal-content"><h2>Loading...</h2></div></div>;
  }

  if (error) {
    return <div className="modal-overlay"><div className="modal-content"><h2>Error: {error}</h2><button onClick={onClose}>Close</button></div></div>;
  }

  if (!detail) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <div className="modal-header">
          <img src={detail.image.large} alt={detail.name} />
          <h2>{detail.name} ({detail.symbol.toUpperCase()})</h2>
        </div>
        <div className="modal-body">
          <p dangerouslySetInnerHTML={{ __html: detail.description.en.split('. ')[0] + '.' }}></p>
          <h3>Market Data</h3>
          <ul>
            <li>Price (USD): ${detail.market_data.current_price.usd.toLocaleString()}</li>
            <li>Price (BRL): R${detail.market_data.current_price.brl.toLocaleString()}</li>
            <li>Market Cap (USD): ${detail.market_data.market_cap.usd.toLocaleString()}</li>
            <li>Market Cap (BRL): R${detail.market_data.market_cap.brl.toLocaleString()}</li>
            <li>24h High (USD): ${detail.market_data.high_24h.usd.toLocaleString()}</li>
            <li>24h Low (USD): ${detail.market_data.low_24h.usd.toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;
