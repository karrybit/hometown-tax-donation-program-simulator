import { MantineProvider } from "@mantine/core";
import type { MetaFunction } from "@remix-run/cloudflare";
import { Simulator } from "~/simulator";

export const meta: MetaFunction = () => {
  return [
    { title: "Hometown Tax Donation Program Economics Simulator" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export default function Index() {
  return (
    <MantineProvider>
      <Simulator />
    </MantineProvider>
  )
}
