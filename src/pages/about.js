// pages/about.js

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function About() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            We are a company dedicated to providing the best services for our clients.
            Our team is composed of skilled professionals who are passionate about delivering
            quality and excellence in everything we do.
          </p>
          <p className="text-lg mb-4">
            Our mission is to offer outstanding solutions that make a difference in the world.
            We value collaboration, innovation, and integrity.
          </p>
        </CardContent>
        <CardFooter>
          <a href="/contact" className="text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded">Contact Us</a>
        </CardFooter>
      </Card>
    </div>
  );
}
