import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Mic, Eye, ArrowRight, LineChart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const features = [
  {
    icon: BookOpen,
    title: 'Text Study',
    description: 'Generate notes, summaries, and quizzes from any topic.',
    link: '/dashboard/chat',
    linkText: 'Start Chat',
  },
  {
    icon: Eye,
    title: 'Vision Analysis',
    description: 'Upload diagrams or notes for instant AI analysis.',
    link: '/dashboard/vision-lab',
    linkText: 'Analyze Image',
  },
  {
    icon: Mic,
    title: 'Real-time Tutor',
    description: 'Practice language or debate topics with a live AI.',
    link: '/dashboard/live-tutor',
    linkText: 'Start Session',
  },
];

const recentActivity = [
    { topic: "Quantum Mechanics", type: "Quiz", date: "2023-10-27" },
    { topic: "Photosynthesis", type: "Summary", date: "2023-10-26" },
    { topic: "The Roman Empire", type: "Chat", date: "2023-10-25" },
    { topic: "Calculus Derivatives", type: "Vision Analysis", date: "2023-10-25" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Hi there, Scholar! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to accelerate your learning with AI?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link href={feature.link}>
                  {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
        
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                <LineChart className="h-6 w-6" />
                Recent Learning Activity
            </h2>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentActivity.map((activity) => (
                        <TableRow key={activity.topic}>
                            <TableCell className="font-medium">{activity.topic}</TableCell>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell className="text-right">{activity.date}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    </div>
  );
}
