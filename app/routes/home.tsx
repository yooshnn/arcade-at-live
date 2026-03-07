import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="font-bold text-3xl">Hello, world!</h1>
    </div>
  );
}
