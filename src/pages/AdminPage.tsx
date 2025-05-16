
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateChallenge } from "@/hooks/useCreateChallenge";
import { toast } from "@/hooks/use-toast";
import ChallengesTable from "@/components/admin/ChallengesTable";
import AdminCheck from "@/components/admin/AdminCheck";
import ChallengeForm, { FormValues } from "@/components/admin/ChallengeForm";
import AIGenerationForm, { AIFormValues } from "@/components/admin/AIGenerationForm";

const AdminPage = () => {
  const { createChallenge, generateChallengeWithAI, isCreating } = useCreateChallenge();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Reference to the manual form for updating with AI-generated values
  const [manualFormValues, setManualFormValues] = useState<Partial<FormValues>>({});
  
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
    } catch (error: any) {
      toast({
        description: `Failed to create challenge: ${error.message}`,
      });
    }
  };

  const onGenerateWithAI = async (values: AIFormValues) => {
    try {
      setIsGeneratingAI(true);
      
      // Generate challenge using AI
      const generatedChallenge = await generateChallengeWithAI(values.instructions);
      
      // Update the form values for the manual tab
      setManualFormValues({
        title: generatedChallenge.title || '',
        description: generatedChallenge.description || '',
        difficulty: generatedChallenge.difficulty || 'Medium',
        solution_template: generatedChallenge.solution_template || '',
        tags: generatedChallenge.tags?.join(', ') || '',
        test_cases: JSON.stringify(generatedChallenge.test_cases || [], null, 2),
      });
      
      toast({
        description: "Challenge generated successfully! Review and make any changes before submitting.",
      });
    } catch (error: any) {
      toast({
        description: `Failed to generate challenge: ${error.message}`,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <AdminCheck>
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
              <Tabs defaultValue="manual">
                <TabsList className="mb-4 grid grid-cols-2">
                  <TabsTrigger value="manual">Manual Creation</TabsTrigger>
                  <TabsTrigger value="ai">AI-Assisted</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual">
                  <ChallengeForm 
                    isCreating={isCreating}
                    onSubmit={onSubmit}
                  />
                </TabsContent>
                
                <TabsContent value="ai">
                  <AIGenerationForm 
                    isGenerating={isGeneratingAI}
                    onGenerate={onGenerateWithAI}
                  />
                </TabsContent>
              </Tabs>
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
    </AdminCheck>
  );
};

export default AdminPage;
