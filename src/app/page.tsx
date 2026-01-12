import { Hero } from "@/components/home/Hero";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { PopularIngredients } from "@/components/home/PopularIngredients";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <TrendingProducts />
      <PopularIngredients />
    </main>
  );
}
