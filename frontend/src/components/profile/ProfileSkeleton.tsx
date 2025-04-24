import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar Skeleton */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-5 w-24 mb-4" />

                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="w-full flex gap-2 mt-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2 w-full mb-1.5" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>

              <Skeleton className="h-px w-full" />

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-center">
                  <Skeleton className="h-10 w-10 rounded-full mx-auto mb-2" />
                  <Skeleton className="h-5 w-12 mx-auto" />
                  <Skeleton className="h-3 w-20 mx-auto mt-1" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-10 w-10 rounded-full mx-auto mb-2" />
                  <Skeleton className="h-5 w-16 mx-auto" />
                  <Skeleton className="h-3 w-20 mx-auto mt-1" />
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-full mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-64" />
          </div>

          {[1, 2, 3].map((i) => (
            <Card className="mb-4" key={i}>
              <CardContent className="p-0">
                <div className="p-4 border-b border-border flex justify-between">
                  <div>
                    <Skeleton className="h-5 w-36 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <div className="p-4 flex gap-4">
                  <Skeleton className="h-32 w-24 flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex justify-end">
                  <Skeleton className="h-8 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
