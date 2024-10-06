"use client";

import { DisplayValue, LabelValueGrid } from "@/components/LabelValueGrid";
import { MultiAgent } from "@/components/transactionFlows/MultiAgent";
import { SingleSigner } from "@/components/transactionFlows/SingleSigner";
import { Sponsor } from "@/components/transactionFlows/Sponsor";
import { TransactionParameters } from "@/components/transactionFlows/TransactionParameters";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MyWallet } from "@/utils/standardWallet";
import { registerWallet } from "@aptos-labs/wallet-standard";
import ModernWeb3Chat from "@/components/ModernWeb3Chat";

(function () {
  if (typeof window === "undefined") return;
  const myWallet = new MyWallet();
  registerWallet(myWallet);
})();

export default function Home() {
  return (
    <main className="min-h-screen">
      <ModernWeb3Chat />
    </main>
  );
}
