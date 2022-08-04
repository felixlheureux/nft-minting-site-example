import { useAppDispatch } from "../../app/app-hooks";
import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { clearGlobalState, hello } from "../slices/global-slice";
import { ethers } from "ethers";
import { abi } from "./abi";
import { MINT_PRICE } from "../../App";

const CONTRACT_ADDRESS = "0x0"

export const useContract = () => {
  const dispatch = useAppDispatch();
  const [ { data: connectData }, connect ] = useConnect();
  const [ , disconnect ] = useAccount();

  const [ loading, setLoading ] = useState(false);

  const allowlistMint = async ({ proof, amount }: { proof: string[], amount: number }) => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const response = await connect(connectData.connectors[0]);
        const provider = new ethers.providers.Web3Provider(response?.data?.provider);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
          abi,
          signer
        );

        let nftTx = await contract.allowlistMint(proof, amount, { value: ethers.utils.parseEther((MINT_PRICE * amount).toString()) });
        let tx = await nftTx.wait();
        console.log("Mined!", tx);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      const response = await connect(connectData.connectors[0]);
      await dispatch(hello({ address: response?.data?.account ?? "" }));

      if (window.ethereum?.on) {
        window.ethereum.on("accountsChanged", logout);
        window.ethereum.on("chainChanged", logout);
        window.ethereum.on("disconnect", logout);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    disconnect();
    dispatch(clearGlobalState());
    if (window.ethereum?.removeListener) {
      window.ethereum.removeListener("accountsChanged", logout);
      window.ethereum.removeListener("chainChanged", logout);
      window.ethereum.removeListener("disconnect", logout);
    }
  };

  return {
    allowlistMint,
    login,
    logout,
    loading
  };
};