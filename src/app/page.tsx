import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Manage Your PDFs with Ease
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A secure and efficient way to organize, store, and manage your PDF documents.
              Upload, search, and access your files from anywhere.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
