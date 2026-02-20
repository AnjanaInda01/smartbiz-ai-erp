import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
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
import { Mail, MessageSquare, Loader2 } from "lucide-react";

const emailSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

const socialPostSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

export default function AiContentPage() {
  const [emailResponse, setEmailResponse] = useState("");
  const [socialPostResponse, setSocialPostResponse] = useState("");
  const [loading, setLoading] = useState({
    email: false,
    socialPost: false,
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
        title="AI Content Generator"
        description="Generate emails and social media posts using AI"
      />

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Generator
          </TabsTrigger>
          <TabsTrigger value="social">
            <MessageSquare className="mr-2 h-4 w-4" />
            Facebook Posts
          </TabsTrigger>
        </TabsList>

        {/* Email Generator Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Generator</CardTitle>
              <CardDescription>
                Generate professional emails for customer follow-ups or communications
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

        {/* Facebook Posts Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Post Generator</CardTitle>
              <CardDescription>
                Create engaging Facebook posts for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitSocialPost(onSocialPostSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social-prompt">Post Prompt</Label>
                  <Textarea
                    id="social-prompt"
                    placeholder='e.g., "Write a Facebook post for new product arrivals"'
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
