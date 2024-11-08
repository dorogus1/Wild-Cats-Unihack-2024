import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/card'; // Modifică calea conform structurii proiectului tău
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Logging in with:', username, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>Log In</Button>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
