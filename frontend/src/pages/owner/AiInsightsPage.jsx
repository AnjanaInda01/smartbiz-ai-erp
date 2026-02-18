import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateInsightApi,
  generateEmailApi,
  generateSocialPostApi,
} from "@/api/aiApi";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Brain, Mail, MessageSquare, Loader2 } from "lucide-react";

const insightSchema = z.object({
  question: z.string().min(1, "Question is required"),
});

const emailSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

const socialPostSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

export default function AiInsightsPage() {
  const [insightResponse, setInsightResponse] = useState("");
  const [emailResponse, setEmailResponse] = useState("");
  const [socialPostResponse, setSocialPostResponse] = useState("");
  const [loading, setLoading] = useState({
    insight: false,
    email: false,
    socialPost: false,
  });

  const {
    register: registerInsight,
    handleSubmit: handleSubmitInsight,
    reset: resetInsight,
    formState: { errors: errorsInsight },
  } = useForm({
    resolver: zodResolver(insightSchema),
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerSocialPost,
    handleSubmit: handleSubmitSocialPost,
    reset: resetSocialPost,
    formState: { errors: errorsSocialPost },
  } = useForm({
    resolver: zodResolver(socialPostSchema),
  });

  const onInsightSubmit = async (data) => {
    try {
      setLoading((prev) => ({ ...prev, insight: true }));
      const res = await generateInsightApi(data.question);
      setInsightResponse(res.data.response);
      resetInsight();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to generate insight";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, insight: false }));
    }
  };

  const onEmailSubmit = async (data) => {
    try {
      setLoading((prev) => ({ ...prev, email: true }));
      const res = await generateEmailApi(data.prompt);
      setEmailResponse(res.data.response);
      resetEmail();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to generate email";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const onSocialPostSubmit = async (data) => {
    try {
      setLoading((prev) => ({ ...prev, socialPost: true }));
      const res = await generateSocialPostApi(data.prompt);
      setSocialPostResponse(res.data.response);
      resetSocialPost();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to generate social post";
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, socialPost: false }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Insights"
        description="Leverage AI to generate insights, emails, and marketing content"
      />

      <Tabs defaultValue="insight" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insight">
            <Brain className="mr-2 h-4 w-4" />
            Business Insights
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Generator
          </TabsTrigger>
          <TabsTrigger value="social">
            <MessageSquare className="mr-2 h-4 w-4" />
            Marketing Posts
          </TabsTrigger>
        </TabsList>

        {/* Business Insights Tab */}
        <TabsContent value="insight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Natural Language Reports</CardTitle>
              <CardDescription>
                Ask questions about your business performance. Example: "How did I perform last month?"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitInsight(onInsightSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insight-question">Your Question</Label>
                  <Input
                    id="insight-question"
                    placeholder='e.g., "How did I perform last month?"'
                    {...registerInsight("question")}
                  />
                  {errorsInsight.question && (
                    <p className="text-sm text-destructive">{errorsInsight.question.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={loading.insight}>
                  {loading.insight ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Insight
                    </>
                  )}
                </Button>
              </form>

              {insightResponse && (
                <div className="mt-4 rounded-lg border bg-muted p-4">
                  <h4 className="mb-2 font-semibold">AI Response:</h4>
                  <p className="whitespace-pre-wrap text-sm">{insightResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Generator Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Generator</CardTitle>
              <CardDescription>
                Generate professional emails for customer follow-ups or complaints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-prompt">Email Prompt</Label>
                  <Textarea
                    id="email-prompt"
                    placeholder="e.g., Write a follow-up email to thank a customer for their recent purchase..."
                    rows={4}
                    {...registerEmail("prompt")}
                  />
                  {errorsEmail.prompt && (
                    <p className="text-sm text-destructive">{errorsEmail.prompt.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={loading.email}>
                  {loading.email ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Generate Email
                    </>
                  )}
                </Button>
              </form>

              {emailResponse && (
                <div className="mt-4 rounded-lg border bg-muted p-4">
                  <h4 className="mb-2 font-semibold">Generated Email:</h4>
                  <p className="whitespace-pre-wrap text-sm">{emailResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Posts Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Post Writer</CardTitle>
              <CardDescription>
                Create engaging social media posts for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitSocialPost(onSocialPostSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social-prompt">Post Prompt</Label>
                  <Textarea
                    id="social-prompt"
                    placeholder='e.g., "Write a Facebook post for new arrivals"'
                    rows={4}
                    {...registerSocialPost("prompt")}
                  />
                  {errorsSocialPost.prompt && (
                    <p className="text-sm text-destructive">{errorsSocialPost.prompt.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={loading.socialPost}>
                  {loading.socialPost ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Generate Post
                    </>
                  )}
                </Button>
              </form>

              {socialPostResponse && (
                <div className="mt-4 rounded-lg border bg-muted p-4">
                  <h4 className="mb-2 font-semibold">Generated Post:</h4>
                  <p className="whitespace-pre-wrap text-sm">{socialPostResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
