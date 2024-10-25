// pages/index.js

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
      <p className="text-lg mb-6">This is the landing page where you can find the latest updates and services we offer.</p>
      <Button asChild variant="primary">
        <a href="/about">Learn More About Us</a>
      </Button>
    </div>
  );
}
