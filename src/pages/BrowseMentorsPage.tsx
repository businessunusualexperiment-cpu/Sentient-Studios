import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { MentorCard } from "@/components/MentorCard";
import { Mentor, PaginatedResponse } from "@shared/types";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDebounce } from "react-use";
import { SpecialtyMultiSelect } from "@/components/SpecialtyMultiSelect";
export function BrowseMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);
  const fetchMentors = useCallback(async (cursor: string | null, search: string, specialties: string[]) => {
    if (cursor === null) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      if (search) params.append('searchTerm', search);
      if (specialties.length > 0) params.append('specialties', specialties.join(','));
      params.append('limit', '12');
      const data = await api<PaginatedResponse<Mentor>>(`/api/mentors?${params.toString()}`);
      setMentors(prev => cursor ? [...prev, ...data.items] : data.items);
      setNextCursor(data.next);
      setHasMore(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch mentors.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);
  useEffect(() => {
    fetchMentors(null, debouncedSearchTerm, selectedSpecialties);
  }, [debouncedSearchTerm, selectedSpecialties, fetchMentors]);
  const handleLoadMore = () => {
    if (nextCursor && !isFetchingMore) {
      fetchMentors(nextCursor, debouncedSearchTerm, selectedSpecialties);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  return (
    <PageLayout>
      <div className="container max-w-7xl px-4 py-12 md:py-16">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Discover Your Mentor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our network of experienced professionals ready to guide you.
          </p>
        </div>
        <div className="my-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, title, etc..."
              className="w-full pl-10 py-6 text-base h-16"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <SpecialtyMultiSelect
            selectedSpecialties={selectedSpecialties}
            onChange={setSelectedSpecialties}
          />
        </div>
        {isLoading && (
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </motion.div>
        )}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {mentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </motion.div>
            </AnimatePresence>
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isFetchingMore}
                  size="lg"
                  variant="outline"
                >
                  {isFetchingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
            {mentors.length === 0 && (
              <div className="text-center py-16 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                  {debouncedSearchTerm || selectedSpecialties.length > 0
                    ? "No mentors found matching your criteria."
                    : "No mentors found."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}