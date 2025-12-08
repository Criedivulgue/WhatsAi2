'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import Logo from './logo';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const brandSchema = z.object({
  brandName: z.string().min(2, 'Brand name must be at least 2 characters.'),
  brandTone: z.string().min(10, 'Please describe your brand tone.'),
  brandRules: z.string().optional(),
});

const detailsSchema = z.object({
  attendantName: z.string().min(2, 'Your name is required.'),
  attendantEmail: z.string().email('Invalid email address.'),
});

const aiConfigSchema = z.object({
  autoSummarize: z.boolean().default(true),
  autoEnrich: z.boolean().default(false),
  autoFollowUp: z.boolean().default(false),
});

const formSchemas = [brandSchema, detailsSchema, aiConfigSchema];

type OnboardingFormValues = z.infer<typeof brandSchema> &
  z.infer<typeof detailsSchema> &
  z.infer<typeof aiConfigSchema>;

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const currentSchema = formSchemas[step];
  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      brandName: '',
      brandTone: '',
      brandRules: '',
      attendantName: '',
      attendantEmail: '',
      autoSummarize: true,
      autoEnrich: false,
      autoFollowUp: false,
    },
  });

  const { handleSubmit, trigger } = methods;

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (step < formSchemas.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: OnboardingFormValues) => {
    console.log('Onboarding data:', data);
    // Here you would typically save the data to your backend
    router.push('/dashboard');
  };

  const progressValue = ((step + 1) / formSchemas.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
          <Card className="shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-primary rounded-full">
                    <Logo className="h-8 w-8 text-primary-foreground" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl">Welcome to WhatsAi</CardTitle>
                    <CardDescription>Let's get your workspace set up.</CardDescription>
                 </div>
              </div>
              <Progress value={progressValue} className="w-full" />
            </CardHeader>
            <CardContent>
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Brand Information</h3>
                  <FormField
                    control={methods.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="brandTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Tone & Voice</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Friendly and professional, use emojis sparingly..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="brandRules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Rules (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Never offer discounts, always greet by name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Details</h3>
                  <FormField
                    control={methods.control}
                    name="attendantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="attendantEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">AI Configuration</h3>
                  <FormField
                    control={methods.control}
                    name="autoSummarize"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Auto-Summarize Chats</FormLabel>
                          <CardDescription>Automatically generate a summary when a chat ends.</CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={methods.control}
                    name="autoEnrich"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Suggest Profile Enrichments</FormLabel>
                           <CardDescription>Let AI suggest new interests and categories for contacts.</CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={methods.control}
                    name="autoFollowUp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Generate Follow-up Ideas</FormLabel>
                          <CardDescription>AI will draft follow-up emails and messages for you.</CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 0 && (
                <Button variant="outline" onClick={prevStep} type="button">
                  Back
                </Button>
              )}
              {step < formSchemas.length - 1 ? (
                <Button onClick={nextStep} type="button" className={step === 0 ? 'ml-auto' : ''}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Finish Setup</Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
