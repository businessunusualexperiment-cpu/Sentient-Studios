import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mentor } from "@shared/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
interface MentorCardProps {
  mentor: Mentor;
}
export function MentorCard({ mentor }: MentorCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-lg dark:bg-card">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
            <AvatarFallback>
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground">{mentor.title}</p>
            <p className="text-sm text-muted-foreground">{mentor.company}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {mentor.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full" variant="outline">
            <Link to={`/mentor/${mentor.id}`}>
              View Profile <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}