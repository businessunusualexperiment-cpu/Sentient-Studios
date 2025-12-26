import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface TestimonialCardProps {
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
}
export function TestimonialCard({ name, title, quote, imageUrl }: TestimonialCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col justify-between rounded-xl border shadow-sm transition-shadow hover:shadow-lg dark:bg-card p-6">
        <CardContent className="flex-1 px-0 pb-4">
          <p className="text-lg text-muted-foreground italic leading-relaxed">"{quote}"</p>
        </CardContent>
        <CardHeader className="flex flex-row items-center gap-4 p-0 pt-4 border-t border-border/60 mt-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-md font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}