
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PlusCircle, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateChallenge } from "@/hooks/useCreateChallenge";
import { toast } from "@/hooks/use-toast";
import ChallengesTable from "@/components/admin/ChallengesTable";

type FormValues = {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solution_template: string;
  tags: string;
  test_cases: string;
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { createChallenge, isCreating } = useCreateChallenge();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Medium",
      solution_template: "function solution() {\n  // Write your solution here\n}",
      tags: "algorithms",
      test_cases: JSON.stringify([
        { input: "example1", expected: "result1" },
        { input: "example2", expected: "result2" }
      ], null, 2),
    },
  });

  useEffect(() => {
    // Redirect non-authenticated users
    if (!isLoading && !user) {
      navigate("/auth");
      toast({
        description: "You must be logged in to access the admin page",
      });
    }
    // Admin check would ideally be here, but we don't have roles configured yet
  }, [user, isLoading, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Parse tags from comma-separated string to array
      const tagArray = values.tags.split(",").map(tag => tag.trim());
      
      // Parse test cases from JSON string
      let parsedTestCases;
      try {
        parsedTestCases = JSON.parse(values.test_cases);
      } catch (err) {
        toast({
          description: "Invalid JSON format for test cases",
        });
        return;
      }
      
      await createChallenge({
        ...values,
        tags: tagArray,
        test_cases: parsedTestCases,
      });
      
      toast({
        description: "Challenge created successfully!",
      });
      
      // Reset form after successful creation
      form.reset();
    } catch (error: any) {
      toast({
        description: `Failed to create challenge: ${error.message}`,
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
            <CardDescription>
              Create a new coding challenge for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the challenge..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Use Markdown for formatting if needed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="algorithms, arrays, strings..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated tags
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="solution_template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution Template</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="function solution() { ... }" 
                          className="min-h-[150px] font-mono"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Initial code that will be shown to students
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="test_cases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Cases</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='[{"input": "example", "expected": "result"}]' 
                          className="min-h-[150px] font-mono"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        JSON array of test cases with input and expected values
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isCreating}
                >
                  <Save className="mr-2" />
                  {isCreating ? "Creating..." : "Create Challenge"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
          <Card className="shadow-md mb-6">
            <CardHeader>
              <CardTitle>Challenges Overview</CardTitle>
              <CardDescription>
                Manage your existing challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChallengesTable />
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <PlusCircle className="mr-2" />
                Add New Challenge
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
