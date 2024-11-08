import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const HomePage = () => {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Welcome to Wild-Cats!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the home page. Customize it with more content as needed.</p>
      </CardContent>
    </Card>
  );
};

export default HomePage;
