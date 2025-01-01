import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer"; // Import the footer component

export const metadata = {
  title: "Research Rec",
  description: "Explore and collaborate on cutting-edge research",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
