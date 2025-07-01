import { useState, useEffect } from "react";
import "./App.css";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  price_change_percentage_1y_in_currency: number;
}

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("usd");
  const [brlRate, setBrlRate] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBrlRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl%2Cusd"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch BRL exchange rate");
        }
        const data = await response.json();
        setBrlRate(data.bitcoin.brl / data.bitcoin.usd);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching BRL rate");
        }
      }
    };

    fetchBrlRate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from CoinGecko API");
        }
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const getPriceColor = (price: number) => {
    return price >= 0 ? "green" : "red";
  };

  const formatPrice = (price: number) => {
    if (currency === "brl") {
      return `R$${(price * brlRate).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return <div className="container"><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className="container"><h1>Error: {error}</h1></div>;
  }

  const filteredCrypto = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container">
      <h1>Cripto View</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Pesquisar..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="currency-toggle">
          <button onClick={() => setCurrency("usd")} className={currency === 'usd' ? 'active' : ''}>USD</button>
          <button onClick={() => setCurrency("brl")} className={currency === 'brl' ? 'active' : ''}>BRL</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Moeda</th>
            <th>Preço ({currency.toUpperCase()})</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>30d</th>
            <th>1y</th>
          </tr>
        </thead>
        <tbody>
          {filteredCrypto.map((crypto, index) => (
            <tr key={crypto.id}>
              <td>{(page - 1) * 20 + index + 1}</td>
              <td>
                <img src={crypto.image} alt={crypto.name} width="20" />
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </td>
              <td>{formatPrice(crypto.current_price)}</td>
              <td style={{ color: getPriceColor(crypto.price_change_percentage_1h_in_currency) }}>
                {crypto.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: getPriceColor(crypto.price_change_percentage_24h_in_currency) }}>
                {crypto.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: getPriceColor(crypto.price_change_percentage_7d_in_currency) }}>
                {crypto.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: getPriceColor(crypto.price_change_percentage_30d_in_currency) }}>
                {crypto.price_change_percentage_30d_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: getPriceColor(crypto.price_change_percentage_1y_in_currency) }}>
                {crypto.price_change_percentage_1y_in_currency?.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={() => setPage(page + 1)}>
          Próxima
        </button>
      </div>
    </main>
  );
}

export default App;
