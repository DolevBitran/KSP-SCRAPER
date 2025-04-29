import { useEffect, useState } from 'react'
import { Product } from './content/contentScript';
import './App.css'
import axios from 'axios';
import Header from './components/Header';
import Table from './components/Table';

interface ScrapedDataMessage {
  type: "SCRAPED_DATA";
  payload: Product[];
}

function App() {
  const [scrapedData, setScrapedData] = useState<Product[]>([]);

  useEffect(() => {
    const handleMessage = (message: ScrapedDataMessage) => {
      if (message.type === "SCRAPED_DATA") {
        setScrapedData(message.payload);
        console.log(message)
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const initiateScraping = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab.id) {
        console.error('No active tab found');
        return;
      }
      chrome.tabs.sendMessage(tab.id, { type: "MANUAL_SCRAPE" }, (response) => {
        console.log({ response });
      });
    });
  }

  const sendResults = async () => {
    const res = await axios.post('http://localhost:3000/products', { products: scrapedData })
    console.log(res)
  }

  return (
    <>
      <Header />
      <div className="card">
        <button onClick={initiateScraping}>
          {scrapedData.length ? 'Scrape again' : 'Scrape tab'}
        </button>
        {
          !!scrapedData.length && <>
            <div className='spacer' />
            <button onClick={sendResults}>
              Send to backend
            </button>
          </>
        }
      </div>
      <p>
        {!!scrapedData.length &&
          <div className="">
            <h1 className="text-lg font-bold">Scraped Products</h1>
            <Table data={scrapedData} />
            {/* <ul className="results_list mt-2">
            {scrapedData.map((product, idx) => (
              <li key={idx} className="product_name text-sm">{product.title}</li>
              ))}
              </ul> */}
          </div>
        }
      </p>
    </>
  )
}

export default App
