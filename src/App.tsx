import "./index.css";
import "@childrenofukiyo/core/dist/style.css";
import "./App.css";
import { useAppSelector } from "./app/app-hooks";
import React, { useState } from "react";
import { selectAuthenticated, selectProof } from "./features/slices/global-slice";
import { useContract } from "./features/contract/use-contract";
import logo from "./favicon.png";

const MINT_AMOUNTS = [ 1, 2, 3 ];
export const MINT_PRICE = 0.001;

function App() {
  const { allowlistMint, login, loading } = useContract();
  const [ selectedAmount, setSelectedAmount ] = useState(1);

  const authenticated = useAppSelector(selectAuthenticated);
  const proof = useAppSelector(selectProof);

  return (
    <div className={"h-screen"}>
      <main className="h-full">
        <div className={"h-full flex justify-center items-center"}>
          <div
            className="relative bg-[#EFEADB]/90 overflow-hidden shadow-2xl rounded-2xl flex-col items-center justify-center py-8 px-12">
            <img src={logo} alt="Logo" width="128" className={"m-auto mb-6 shadow-md rounded-full"} />
            {authenticated ? (
              <button onClick={() => allowlistMint({ proof, amount: selectedAmount })} fullWidth>Mint</button>
            ) : (
              <button onClick={login}>Connect</button>
            )}
            <div className={"flex mt-6 gap-4"}>
              {MINT_AMOUNTS.map((amount) => (
                <div
                  className={`py-2 px-6 border hover:bg-slate-50 font-medium rounded-lg shadow-md cursor-pointer active:translate-y-0.5 transition-all ease-out ${amount === selectedAmount ? "bg-slate-50 border-[#72F5F1]" : "bg-white border-slate-300"}`}
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}>
                  {amount}
                </div>
              ))}
            </div>
            {loading &&
              <div className={"absolute h-full w-full bg-[#EFEADB] left-0 top-0 flex items-center justify-center"}>
                Loading...
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
