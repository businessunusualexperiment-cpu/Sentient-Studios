import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mentor, Connection } from "@shared/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, CheckCircle, Clock, Loader2, X, XCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
interface ConnectionCardProps {
  mentor: Mentor;
  connection: Connection;
  onAccept?: (connectionId: string) => void;
  onDecline?: (connectionId: string) => void;
  isResponding?: boolean;
  initialMessage?: string;
  chatId?: string; // Added chatId prop
}
export function ConnectionCard({ mentor, connection, onAccept, onDecline, isResponding, initialMessage, chatId }: ConnectionCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const status = connection.status;
  const statusConfig = {
    pending: { icon: Clock, text: "Pending", color: "text-yellow-500" },
    accepted: { icon: CheckCircle, text: "Accepted", color: "text-green-500" },
    declined: { icon: XCircle, text: "Declined", color: "text-red-500" },
  };
  const StatusIcon = statusConfig[status].icon;
  return (
    <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-lg dark:bg-card">
        <CardHeader className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
              <AvatarFallback>{mentor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.title}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className={cn("flex items-center gap-2 text-sm font-medium", statusConfig[status].color)}>
            <StatusIcon className="h-4 w-4" />
            <span>{statusConfig[status].text}</span>
          </div>
          {initialMessage && (
            <div className="mt-4 text-sm text-muted-foreground italic border-l-2 pl-3 border-border">
              "{initialMessage}"
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {mentor.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="secondary">{specialty}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2 p-4 pt-0">
          {status === 'pending' && onAccept && onDecline && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onDecline(connection.id)} disabled={isResponding}>
                {isResponding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="mr-2 h-4 w-4" /> Decline</>}
              </Button>
              <Button size="sm" onClick={() => onAccept(connection.id)} disabled={isResponding} className="bg-green-600 hover:bg-green-700">
                {isResponding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Accept</>}
              </Button>
            </div>
          )}
          {status === 'accepted' && chatId && (
            <Button asChild size="sm" className="bg-brand hover:bg-brand-600">
              <Link to={`/chat/${chatId}`}>
                <MessageSquare className="mr-2 h-4 w-4" /> Message
              </Link>
            </Button>
          )}
          <Button asChild size="sm" variant="ghost">
            <Link to={`/mentor/${mentor.id}`}>
              View Profile <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}