import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md p-8 bg-white border-neutral-200/90 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <Badge variant="neutral">Authentication Shell</Badge>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 pt-1">
            Create an account
          </h1>
          <p className="text-xs text-neutral-500">
            Join VoyageHub to manage multi-modal tickets and instant refunds
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 block">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 block">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 block">Create Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="md">
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-neutral-900 hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};
