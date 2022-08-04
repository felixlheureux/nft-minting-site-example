import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { Provider } from "react-redux";
import { store } from "./app/app-store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { defaultChains, Provider as WAGMIProvider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

Sentry.init({
  dsn: "https://760ae8f8e1cf458099365287e58e69ce@o1171364.ingest.sentry.io/6265731",
  integrations: [ new BrowserTracing() ],
  normalizeDepth: 10,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.2,
  enabled: import.meta.env.MODE === "production"
});

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true }
    })
  ];
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <WAGMIProvider connectors={connectors}>
          <App />
        </WAGMIProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
