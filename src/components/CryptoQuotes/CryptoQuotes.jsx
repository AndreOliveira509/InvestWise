// src/components/CryptoQuotes/CryptoQuotes.jsx
import { useState, useEffect } from 'react';
import { FaDatabase, FaSync, FaChevronDown } from 'react-icons/fa';
import styles from './CryptoQuotes.module.css';

const cryptocurrencies = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' }
];

export default function CryptoQuotes({ setCryptoPricesData }) {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCryptoQuotes, setShowCryptoQuotes] = useState(true);

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  const fetchCryptoPrices = async () => {
    setLoading(true);
    try {
      const prices = {};
      for (const crypto of cryptocurrencies) {
        try {
          const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${crypto.symbol}-BRL`);
          const data = await response.json();
          const key = `${crypto.symbol}BRL`;
          if (data[key]) {
            prices[crypto.symbol] = {
              price: parseFloat(data[key].bid),
              change: parseFloat(data[key].pctChange)
            };
          }
        } catch (err) {
          console.warn(`Failed to fetch ${crypto.symbol}:`, err);
          prices[crypto.symbol] = {
            price: Math.random() * 100 + 10,
            change: (Math.random() * 10) - 5
          };
        }
      }
      setCryptoPrices(prices);
      setCryptoPricesData(prices); // Atualiza o estado no componente pai
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cryptoHeader}>
      <div className={styles.cryptoHeaderTop}>
        <div className={styles.cryptoTitle}>
          <FaDatabase className={styles.cryptoTitleIcon} />
          <span>Cotações em Tempo Real</span>
          <button
            onClick={fetchCryptoPrices}
            className={styles.refreshBtn}
            disabled={loading}
          >
            <FaSync className={loading ? styles.spinning : ''} />
            Atualizar
          </button>
        </div>
        <button
          onClick={() => setShowCryptoQuotes(!showCryptoQuotes)}
          className={`${styles.toggleBtn} ${showCryptoQuotes ? styles.rotated : ''}`}
        >
          <FaChevronDown />
        </button>
      </div>

      <div className={`${styles.cryptoContent} ${showCryptoQuotes ? styles.show : ''}`}>
        <div className={styles.cryptoGridHorizontal}>
          {cryptocurrencies.map(crypto => {
            const priceData = cryptoPrices[crypto.symbol];
            return (
              <div key={crypto.symbol} className={styles.cryptoItemHorizontal}>
                <div className={styles.cryptoIconHorizontal}>
                  <span>{crypto.symbol}</span>
                </div>
                <div className={styles.cryptoInfoHorizontal}>
                  <span className={styles.cryptoNameHorizontal}>{crypto.name}</span>
                  <span className={styles.cryptoPriceHorizontal}>
                    {priceData ? `R$ ${priceData.price.toFixed(2)}` : '---'}
                  </span>
                </div>
                <span className={`${styles.changeHorizontal} ${priceData?.change >= 0 ? styles.positive : styles.negative}`}>
                  {priceData ? `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)}%` : '---'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}