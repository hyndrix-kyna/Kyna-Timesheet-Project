// /pages/about.js

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function About() {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto p-8 flex flex-col items-center min-h-screen">
      <div
        className={`w-full max-w-2xl p-8 rounded-lg shadow-lg ${
          theme === 'dark' ? 'text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <Card>
          <CardHeader>
            <h1 className="text-5xl font-semibold mb-4 text-center">About Us</h1>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-center">
              We are dedicated to providing the best services. Our team consists of professionals committed to quality,
              innovation, and integrity. Our goal is to make your organizational tasks easier.
            </p>
            <div className="flex justify-between my-6">
              <div className="text-center">
                <h2 className="text-3xl font-semibold">100+</h2>
                <p>Clients Served</p>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-semibold">200+</h2>
                <p>Projects Completed</p>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-semibold">24/7</h2>
                <p>Support</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            <Button
              variant="default"
              className="px-6 py-2 text-lg font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
            >
            Contact Us
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
