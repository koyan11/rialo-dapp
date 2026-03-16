import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Rialo DApp",
  projectId: "f99404a1da1d721c2d3d4f303b305cea",
  chains: [sepolia],
  ssr: true,
});
