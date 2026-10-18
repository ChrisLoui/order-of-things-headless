import { redirect } from "next/navigation";

// The exam builds a single product page; the home route goes straight to it.
export default function Home() {
  redirect("/products/no-1-woody-vetiver");
}
