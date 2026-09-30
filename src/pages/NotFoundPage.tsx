import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Card className="max-w-md p-8 bg-white border-neutral-200/90 shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">404 Error</span>
          <h1 className="text-xl font-bold text-neutral-900">Destination Not Found</h1>
          <p className="text-xs text-neutral-500">
            The travel route or page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/">
            <Button size="sm" variant="primary" className="gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
