import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Lightbulb, Users } from "lucide-react";
import { TestimonialCard } from "@/components/TestimonialCard";
export function HomePage() {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };
  const features = [
    {
      icon: <Users className="h-10 w-10 text-brand" />,
      title: "Expert Mentors",
      description: "Connect with industry leaders and experienced professionals from top companies worldwide.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-brand" />,
      title: "Personalized Guidance",
      description: "Receive one-on-one mentorship tailored to your specific career goals and challenges.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-brand" />,
      title: "Career Acceleration",
      description: "Gain valuable insights, expand your network, and unlock new opportunities for growth.",
    },
  ];
  const testimonials = [
    {
      name: "Alex Johnson",
      title: "Software Engineer at TechCorp",
      quote: "Sentient Studios helped me find an incredible mentor who guided me through my career transition. The platform is intuitive and truly fosters meaningful connections.",
      imageUrl: "https://i.pravatar.cc/150?u=alexjohnson",
    },
    {
      name: "Maria Garcia",
      title: "Product Manager at InnovateX",
      quote: "I was struggling with my product strategy, and my mentor from Sentient Studios provided invaluable insights. Highly recommend this platform for anyone seeking growth.",
      imageUrl: "https://i.pravatar.cc/150?u=mariagarcia",
    },
    {
      name: "Ben Carter",
      title: "UX Designer at CreativeLabs",
      quote: "The design of Sentient Studios itself is inspiring! Finding a mentor who understood my niche was effortless, and their advice has been a game-changer for my portfolio.",
      imageUrl: "https://i.pravatar.cc/150?u=bencarter",
    },
    {
      name: "Sophia Lee",
      title: "Data Scientist at Quantify Inc.",
      quote: "Connecting with a senior data scientist through Sentient Studios opened doors I never thought possible. The mentorship has been pivotal in refining my technical skills.",
      imageUrl: "https://i.pravatar.cc/150?u=sophialee",
    },
  ];
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] md:h-[70vh] lg:h-[80vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent" />
        <div className="relative z-10 container max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Connect with Leaders, Accelerate Your Growth
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 sm:text-xl md:text-2xl">
              Sentient Studios is your gateway to personalized mentorship from the best in the industry. Find your catalyst for success today.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-brand hover:bg-brand-600 text-white font-semibold px-8 py-6 text-lg transition-transform duration-200 hover:scale-105 active:scale-95">
                <Link to="/browse">
                  Find Your Mentor <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-7xl px-4">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Sentient Studios?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We provide a platform for meaningful connections that drive real career progress.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={featureVariants}
                className="flex flex-col items-center text-center p-8 rounded-xl border bg-card shadow-sm"
              >
                {feature.icon}
                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 dark:from-gray-900 to-blue-100 dark:to-gray-950">
        <div className="container max-w-7xl px-4">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Mentees Say</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from individuals who have transformed their careers with guidance from Sentient Studios mentors.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={featureVariants} // Reusing featureVariants for staggered animation
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Find Your Mentor?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join a community of ambitious professionals and experienced leaders. Your journey to success starts here.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-brand hover:bg-brand-600 text-white font-semibold px-8 py-6 text-lg transition-transform duration-200 hover:scale-105 active:scale-95">
              <Link to="/browse">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}