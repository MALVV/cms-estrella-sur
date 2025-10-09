import { NewsEventsManagement } from '@/components/admin/news-events-management';

export default function NewsEventsManagementPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark font-condensed mb-2">
            Content Management
          </h1>
          <p className="text-muted-foreground">
            Manage news and events for the organization
          </p>
        </div>
        
        <NewsEventsManagement />
      </div>
    </div>
  );
}
