
import { useForm } from "react-hook-form";
import { Sparkles, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export type AIFormValues = {
  instructions: string;
};

interface AIGenerationFormProps {
  isGenerating: boolean;
  onGenerate: (values: AIFormValues) => Promise<void>;
}

const AIGenerationForm = ({ isGenerating, onGenerate }: AIGenerationFormProps) => {
  const { toast } = useToast();
  const form = useForm<AIFormValues>({
    defaultValues: {
      instructions: "Create a medium difficulty challenge about array manipulation that requires finding the maximum sum of a subarray.",
    },
  });

  const handleFormSubmit = async (values: AIFormValues) => {
    try {
      await onGenerate(values);
    } catch (error: any) {
      toast({
        description: `Generation failed: ${error.message}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions for AI</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what kind of challenge you want..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Describe the topic, difficulty level, and any specific requirements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          variant="secondary"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" />
              Generate Challenge with AI
            </>
          )}
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <p>After generating, review and edit the challenge in the Manual Creation tab before saving.</p>
        </div>
      </form>
    </Form>
  );
};

export default AIGenerationForm;
