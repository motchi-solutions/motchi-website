import { networkInterfaces } from "node:os";

// Next validates the development WebSocket origin before hydrating the page.
// Allow this machine's actual LAN addresses, without a wildcard or fixed IP.
export function localDevOrigins(): string[] {
  if (process.env.NODE_ENV !== "development") return [];
  return [
    ...new Set(
      Object.values(networkInterfaces()).flatMap((addresses) =>
        (addresses ?? [])
          .filter((address) => !address.internal && address.family === "IPv4")
          .map((address) => address.address),
      ),
    ),
  ];
}
