import Hero from "@/components/home/Hero";
import Info from "@/components/home/Info";
import Categories from "@/components/home/Categories";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Info />
      <Categories />
    </main>
  );
}