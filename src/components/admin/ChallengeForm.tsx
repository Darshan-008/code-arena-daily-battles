
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";

export type FormValues = {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solution_template: string;
  tags: string;
  test_cases: string;
};

interface ChallengeFormProps {
  isCreating: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: Partial<FormValues>;
}

const ChallengeForm = ({ isCreating, onSubmit, initialValues = {} }: ChallengeFormProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      title: initialValues.title || "",
      description: initialValues.description || "",
      difficulty: initialValues.difficulty || "Medium",
      solution_template: initialValues.solution_template || "function solution() {\n  // Write your solution here\n}",
      tags: initialValues.tags || "algorithms",
      test_cases: initialValues.test_cases || JSON.stringify([
        { input: "example1", expected: "result1" },
        { input: "example2", expected: "result2" }
      ], null, 2),
    },
  });
  
  // Update form when initialValues change (e.g., from AI generation)
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      form.reset({
        title: initialValues.title || form.getValues("title"),
        description: initialValues.description || form.getValues("description"),
        difficulty: initialValues.difficulty || form.getValues("difficulty"),
        solution_template: initialValues.solution_template || form.getValues("solution_template"),
        tags: initialValues.tags || form.getValues("tags"),
        test_cases: initialValues.test_cases || form.getValues("test_cases"),
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: FormValues) => {
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
      
      await onSubmit({
        ...values,
        tags: values.tags, // Keep as string - will be processed in the parent component
        test_cases: values.test_cases, // Keep as string - will be processed in the parent component
      });
      
      // Reset form after successful creation
      form.reset({
        title: "",
        description: "",
        difficulty: "Medium",
        solution_template: "function solution() {\n  // Write your solution here\n}",
        tags: "algorithms",
        test_cases: JSON.stringify([
          { input: "example1", expected: "result1" },
          { input: "example2", expected: "result2" }
        ], null, 2),
      });
    } catch (error: any) {
      toast({
        description: `Failed to create challenge: ${error.message}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  value={field.value}
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
  );
};

export default ChallengeForm;
